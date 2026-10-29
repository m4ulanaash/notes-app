class ConfirmDialog extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal" hidden>
        <div class="modal__backdrop" data-result="false"></div>
        <div
          class="modal__card"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-message"
        >
          <h2 class="modal__title" id="modal-title"></h2>
          <p class="modal__message" id="modal-message"></p>
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" data-result="false">Batal</button>
            <button type="button" class="btn btn--danger" data-result="true">Hapus</button>
          </div>
        </div>
      </div>
    `;

    this._modal = this.querySelector(".modal");
    this._title = this.querySelector(".modal__title");
    this._message = this.querySelector(".modal__message");
    this._confirmButton = this.querySelector('.modal__actions [data-result="true"]');
    this._cancelButton = this.querySelector('.modal__actions [data-result="false"]');

    this._modal.addEventListener("click", (event) => {
      const target = event.target.closest("[data-result]");
      if (target) this.close(target.dataset.result === "true");
    });

    this.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close(false);
    });
  }

  open({ title = "Konfirmasi", message = "", confirmLabel = "Hapus", cancelLabel = "Batal" } = {}) {
    if (!this._modal) return Promise.resolve(false);

    this._title.textContent = title;
    this._message.textContent = message;
    this._confirmButton.textContent = confirmLabel;
    this._cancelButton.textContent = cancelLabel;

    this._previousFocus = document.activeElement;
    this._modal.hidden = false;
    this._cancelButton.focus();

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  close(result) {
    if (!this._modal || this._modal.hidden) return;

    this._modal.hidden = true;
    this._previousFocus?.focus?.();

    if (this._resolve) {
      this._resolve(Boolean(result));
      this._resolve = null;
    }
  }
}

customElements.define("confirm-dialog", ConfirmDialog);
