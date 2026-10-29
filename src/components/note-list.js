class NoteList extends HTMLElement {
  static get observedAttributes() {
    return ["empty-text"];
  }

  constructor() {
    super();
    this._notes = [];
    this._error = "";
  }

  set notes(value) {
    this._notes = Array.isArray(value) ? value : [];
    this._error = "";
    if (this.isConnected) this.render();
  }

  get notes() {
    return this._notes;
  }

  set error(message) {
    this._error = message || "";
    if (this.isConnected) this.render();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = "";

    if (this._error) {
      this.renderError();
      return;
    }

    if (this._notes.length === 0) {
      this.renderEmpty();
      return;
    }

    const grid = document.createElement("div");
    grid.className = "notes-grid";

    this._notes.forEach((note, index) => {
      const item = document.createElement("note-item");
      item.style.setProperty("--delay", `${Math.min(index, 8) * 45}ms`);
      item.note = note;
      grid.appendChild(item);
    });

    this.appendChild(grid);
  }

  renderEmpty() {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = this.getAttribute("empty-text") || "Tidak ada catatan.";
    this.appendChild(empty);
  }

  renderError() {
    const wrapper = document.createElement("div");
    wrapper.className = "empty empty--error";

    const message = document.createElement("p");
    message.textContent = this._error;

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "btn-ghost";
    retryButton.textContent = "Coba lagi";
    retryButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("retry-load", { bubbles: true, composed: true }));
    });

    wrapper.append(message, retryButton);
    this.appendChild(wrapper);
  }
}

customElements.define("note-list", NoteList);
