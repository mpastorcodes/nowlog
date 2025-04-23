import { Controller } from "@hotwired/stimulus";

// Autoresize textarea as the user types
export default class extends Controller {
  connect() {
    this.resize();
    // Add event listener for Enter key to submit form
    this.element.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  resize() {
    this.element.style.height = "auto";
    this.element.style.height = this.element.scrollHeight + "px";
  }

  handleKeydown(event) {
    // Auto-resize on input
    this.resize();

    // Submit on Enter without Shift key
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.element.form.requestSubmit();
    }
  }
}
