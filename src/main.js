import "./styles.css";
import "./components/app-bar.js";
import "./components/note-item.js";
import "./components/note-list.js";
import "./components/note-form.js";
import "./components/loading-indicator.js";
import "./components/feedback-toast.js";
import "./components/confirm-dialog.js";

import {
  archiveNote,
  createNote,
  deleteNote,
  fetchNotes,
  unarchiveNote,
} from "./data/notes-api.js";

const activeList = document.querySelector("#active-list");
const archivedList = document.querySelector("#archived-list");
const activeCount = document.querySelector("#active-count");
const archiveCount = document.querySelector("#archive-count");
const refreshButton = document.querySelector("#refresh-button");
const noteForm = document.querySelector("note-form");
const loadingIndicator = document.querySelector("#app-loading");
const toast = document.querySelector("#app-toast");
const confirmDialog = document.querySelector("#app-confirm");

const state = {
  activeNotes: [],
  archivedNotes: [],
  isLoading: false,
  isPending: false,
};

function setLoading(isLoading, message) {
  if (isLoading) {
    loadingIndicator.show(message);
  } else {
    loadingIndicator.hide();
  }
}

function renderLists() {
  activeList.notes = state.activeNotes;
  archivedList.notes = state.archivedNotes;
  activeCount.textContent = state.activeNotes.length;
  archiveCount.textContent = state.archivedNotes.length;
}

function sortByNewest(notes) {
  return [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function refreshNotes() {
  const { activeNotes, archivedNotes } = await fetchNotes();
  state.activeNotes = sortByNewest(activeNotes);
  state.archivedNotes = sortByNewest(archivedNotes);
  renderLists();
}

async function loadNotes() {
  if (state.isLoading || state.isPending) return;

  state.isLoading = true;
  setLoading(true, "Memuat catatan...");

  try {
    await refreshNotes();
  } catch (error) {
    toast.show(error.message, "error");

    if (state.activeNotes.length === 0 && state.archivedNotes.length === 0) {
      const message = "Gagal memuat catatan. Periksa koneksi internet lalu coba lagi.";
      activeList.error = message;
      archivedList.error = message;
    }
  } finally {
    state.isLoading = false;
    setLoading(false);
  }
}

async function mutate({ loadingMessage, action, successMessage }) {
  if (state.isPending) return false;

  state.isPending = true;
  setLoading(true, loadingMessage);

  let isSuccess = false;

  try {
    await action();
    isSuccess = true;

    try {
      await refreshNotes();
    } catch (error) {
      toast.show(`Catatan tersimpan, tetapi daftar gagal dimuat ulang. ${error.message}`, "error");
    }

    toast.show(successMessage, "success");
  } catch (error) {
    toast.show(error.message, "error");
  } finally {
    state.isPending = false;
    setLoading(false);
  }

  return isSuccess;
}

noteForm.addEventListener("note-added", async (event) => {
  if (state.isLoading || state.isPending) return;

  const { title, body } = event.detail;
  noteForm.setSubmitting(true);

  const isSuccess = await mutate({
    loadingMessage: "Menyimpan catatan...",
    action: () => createNote({ title, body }),
    successMessage: "Catatan berhasil ditambahkan.",
  });

  noteForm.setSubmitting(false);

  if (isSuccess) {
    noteForm.reset();
  }
});

document.addEventListener("note-action", async (event) => {
  const { action, id } = event.detail || {};
  if (!id || state.isLoading || state.isPending) return;

  const note = [...state.activeNotes, ...state.archivedNotes].find((item) => item.id === id);
  if (!note) return;

  if (action === "delete") {
    const isConfirmed = await confirmDialog.open({
      title: "Hapus catatan?",
      message: `Catatan "${note.title}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Hapus",
      cancelLabel: "Batal",
    });

    if (!isConfirmed) return;

    await mutate({
      loadingMessage: "Menghapus catatan...",
      action: () => deleteNote(id),
      successMessage: "Catatan berhasil dihapus.",
    });
    return;
  }

  if (action === "archive") {
    await mutate({
      loadingMessage: "Mengarsipkan catatan...",
      action: () => archiveNote(id),
      successMessage: "Catatan dipindahkan ke arsip.",
    });
    return;
  }

  if (action === "unarchive") {
    await mutate({
      loadingMessage: "Membatalkan arsip...",
      action: () => unarchiveNote(id),
      successMessage: "Catatan dikembalikan ke daftar aktif.",
    });
  }
});

document.addEventListener("retry-load", () => {
  loadNotes();
});

refreshButton.addEventListener("click", () => {
  loadNotes();
});

loadNotes();
