class FeedbackToast extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="toast-stack" aria-live="polite" aria-atomic="false"></div>';
    this._stack = this.querySelector(".toast-stack");
  }

  show(message, type = "success", duration = 4000) {
    if (!this._stack) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");

    const text = document.createElement("p");
    text.className = "toast__text";
    text.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "toast__close";
    closeButton.setAttribute("aria-label", "Tutup notifikasi");
    closeButton.textContent = "\u00d7";
    closeButton.addEventListener("click", () => this.dismiss(toast));

    toast.append(text, closeButton);
    this._stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => this.dismiss(toast), duration);
  }

  dismiss(toast) {
    if (!toast.isConnected) return;
    toast.classList.remove("is-visible");

    const removeToast = () => toast.remove();
    toast.addEventListener("transitionend", removeToast, { once: true });
    setTimeout(removeToast, 350);
  }
}

customElements.define("feedback-toast", FeedbackToast);
