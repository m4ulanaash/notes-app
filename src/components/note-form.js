class NoteForm extends HTMLElement {
  get maxTitle() {
    const limit = parseInt(this.getAttribute("max-title"), 10);
    return Number.isNaN(limit) || limit <= 0 ? 50 : limit;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <form novalidate>
        <div class="form-group" data-field="title">
          <label for="note-title">Judul</label>
          <input
            type="text"
            id="note-title"
            name="title"
            placeholder="Judul catatan"
            autocomplete="off"
            maxlength="${this.maxTitle}"
          />
          <div class="form-meta">
            <span class="error-message" aria-live="polite"></span>
            <span class="counter">0/${this.maxTitle}</span>
          </div>
        </div>
        <div class="form-group" data-field="body">
          <label for="note-body">Isi Catatan</label>
          <textarea
            id="note-body"
            name="body"
            placeholder="Tulis catatanmu di sini..."
          ></textarea>
          <div class="form-meta">
            <span class="error-message" aria-live="polite"></span>
          </div>
        </div>
        <button type="submit" class="btn" disabled>Simpan Catatan</button>
      </form>
    `;

    this.form = this.querySelector("form");
    this.titleInput = this.querySelector("#note-title");
    this.bodyInput = this.querySelector("#note-body");
    this.submitBtn = this.querySelector('button[type="submit"]');
    this.counter = this.querySelector(".counter");

    this.titleInput.addEventListener("input", () => {
      this.counter.textContent = `${this.titleInput.value.length}/${this.maxTitle}`;
      this.validateTitle();
      this.updateButton();
    });
    this.bodyInput.addEventListener("input", () => {
      this.validateBody();
      this.updateButton();
    });
    this.titleInput.addEventListener("blur", () => this.validateTitle());
    this.bodyInput.addEventListener("blur", () => this.validateBody());

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isTitleValid = this.validateTitle();
      const isBodyValid = this.validateBody();
      if (!isTitleValid || !isBodyValid) return;

      this.dispatchEvent(
        new CustomEvent("note-added", {
          bubbles: true,
          detail: {
            title: this.titleInput.value.trim(),
            body: this.bodyInput.value.trim(),
          },
        })
      );
    });
  }

  titleError() {
    const value = this.titleInput.value.trim();
    if (!value) return "Judul wajib diisi.";
    if (value.length < 3) return "Judul minimal 3 karakter.";
    if (value.length > this.maxTitle) return `Judul maksimal ${this.maxTitle} karakter.`;
    return "";
  }

  bodyError() {
    const value = this.bodyInput.value.trim();
    if (!value) return "Isi catatan wajib diisi.";
    if (value.length < 5) return "Isi catatan minimal 5 karakter.";
    return "";
  }

  showState(input, message) {
    const group = input.closest(".form-group");
    group.querySelector(".error-message").textContent = message;
    group.classList.toggle("is-invalid", Boolean(message));
    group.classList.toggle("is-valid", !message);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  validateTitle() {
    return this.showState(this.titleInput, this.titleError());
  }

  validateBody() {
    return this.showState(this.bodyInput, this.bodyError());
  }

  updateButton() {
    const isInvalid = Boolean(this.titleError() || this.bodyError());
    this.submitBtn.disabled = this.isSubmitting || isInvalid;
  }

  setSubmitting(isSubmitting) {
    this.isSubmitting = Boolean(isSubmitting);
    this.form.setAttribute("aria-busy", String(this.isSubmitting));
    this.titleInput.disabled = this.isSubmitting;
    this.bodyInput.disabled = this.isSubmitting;
    this.submitBtn.textContent = this.isSubmitting ? "Menyimpan catatan..." : "Simpan Catatan";
    this.updateButton();
  }

  reset() {
    this.form.reset();
    this.counter.textContent = `0/${this.maxTitle}`;
    this.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("is-valid", "is-invalid");
      group.querySelector(".error-message").textContent = "";
    });
    this.titleInput.removeAttribute("aria-invalid");
    this.bodyInput.removeAttribute("aria-invalid");
    this.setSubmitting(false);
  }
}

customElements.define("note-form", NoteForm);
