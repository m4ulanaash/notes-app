class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.hidden = true;
    this.innerHTML = `
      <div class="loader" role="status" aria-live="polite">
        <span class="loader__spinner" aria-hidden="true"></span>
        <span class="loader__message">Memuat catatan...</span>
      </div>
    `;
    this._message = this.querySelector(".loader__message");
  }

  show(message = "Memuat catatan...") {
    if (this._message) this._message.textContent = message;
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
