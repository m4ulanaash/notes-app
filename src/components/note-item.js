const ARCHIVE_ICON = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
    <path d="M1 3h22v5H1z" />
    <path d="M10 12h4" />
  </svg>
`;

const DELETE_ICON = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
`;

class NoteItem extends HTMLElement {
  set note(value) {
    this._note = value;
    if (this.isConnected) this.render();
  }

  get note() {
    return this._note;
  }

  connectedCallback() {
    this.render();
  }

  formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  render() {
    const note = this._note;
    if (!note) return;

    const archiveLabel = note.archived ? "Batalkan arsip" : "Arsipkan";
    const archiveAction = note.archived ? "unarchive" : "archive";

    this.innerHTML = `
      <article class="note ${note.archived ? "note--archived" : ""}">
        <header class="note__header">
          <h3 class="note__title"></h3>
          ${note.archived ? '<span class="note__badge">Diarsipkan</span>' : ""}
        </header>
        <time class="note__date"></time>
        <p class="note__body"></p>
        <div class="note__actions">
          <button type="button" class="btn-icon" data-action="${archiveAction}">
            ${ARCHIVE_ICON}
            <span>${archiveLabel}</span>
          </button>
          <button type="button" class="btn-icon btn-icon--danger" data-action="delete">
            ${DELETE_ICON}
            <span>Hapus</span>
          </button>
        </div>
      </article>
    `;

    this.querySelector(".note__title").textContent = note.title;
    this.querySelector(".note__body").textContent = note.body;

    const time = this.querySelector(".note__date");
    time.textContent = this.formatDate(note.createdAt);
    time.setAttribute("datetime", note.createdAt);

    this.querySelector(".note__actions").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      this.dispatchEvent(
        new CustomEvent("note-action", {
          bubbles: true,
          composed: true,
          detail: {
            action: button.dataset.action,
            id: note.id,
          },
        })
      );
    });
  }
}

customElements.define("note-item", NoteItem);
