class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ["heading", "subtitle"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const heading = this.getAttribute("heading") || "Notes App";
    const subtitle = this.getAttribute("subtitle") || "";

    this.innerHTML = `
      <header class="app-bar">
        <div class="app-bar__inner">
          <div class="app-bar__brand">
            <span class="app-bar__logo" aria-hidden="true">N</span>
            <div>
              <h1 class="app-bar__title"></h1>
              <p class="app-bar__subtitle"></p>
            </div>
          </div>
          <span class="app-bar__status">
            <span class="app-bar__dot" aria-hidden="true"></span>
            Notes API v2
          </span>
        </div>
      </header>
    `;

    this.querySelector(".app-bar__title").textContent = heading;
    this.querySelector(".app-bar__subtitle").textContent = subtitle;
  }
}

customElements.define("app-bar", AppBar);
