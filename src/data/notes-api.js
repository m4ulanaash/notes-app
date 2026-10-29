const BASE_URL = "https://notes-api.dicoding.dev/v2";
const REQUEST_TIMEOUT = 15000;

async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || payload?.status === "fail") {
      throw new Error(payload?.message || `Permintaan gagal (${response.status}).`);
    }

    return payload?.data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Permintaan melebihi batas waktu. Silakan coba lagi.");
    }
    if (error instanceof TypeError) {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchNotes() {
  const [activeNotes, archivedNotes] = await Promise.all([
    request("/notes"),
    request("/notes/archived"),
  ]);

  return {
    activeNotes: Array.isArray(activeNotes) ? activeNotes : [],
    archivedNotes: Array.isArray(archivedNotes) ? archivedNotes : [],
  };
}

export function createNote({ title, body }) {
  return request("/notes", {
    method: "POST",
    body: { title, body },
  });
}

export function deleteNote(id) {
  return request(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function archiveNote(id) {
  return request(`/notes/${encodeURIComponent(id)}/archive`, { method: "POST" });
}

export function unarchiveNote(id) {
  return request(`/notes/${encodeURIComponent(id)}/unarchive`, { method: "POST" });
}
