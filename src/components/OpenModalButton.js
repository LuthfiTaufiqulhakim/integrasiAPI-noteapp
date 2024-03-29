import { getCallback } from "../utils.js";

class OpenModalButton extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    this.handleOnClick = this.handleOnClick.bind(this);
    this.render();

    this.button = this.root.querySelector(".open-modal");
    this.button.addEventListener("click", this.handleOnClick);
  }

  static get observedAttributes() {
    return ["open-modal"];
  }

  get openModal() {
    return this.getAttribute("open-modal");
  }

  set openModal(value) {
    this.setAttribute("open-modal", value);
  }

  handleOnClick() {
    this.openModalCallback = getCallback(this.openModal);

    this.openModalCallback();
  }

  render() {
    this.root.innerHTML = `
      <style>
      .open-modal {
        align-items: center;
        background-color: #fee6e3;
        border: 2px solid #111;
        border-radius: 8px;
        box-sizing: border-box;
        color: #111;
        cursor: pointer;
        display: flex;
        font-family: Inter,sans-serif;
        font-size: 16px;
        height: 48px;
        justify-content: center;
        line-height: 24px;
        max-width: 100%;
        padding: 0 25px;
        position: relative;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      
      .open-modal:after {
        background-color: #111;
        border-radius: 8px;
        content: "";
        display: block;
        height: 48px;
        left: 0;
        width: 100%;
        position: absolute;
        top: -2px;
        transform: translate(8px, 8px);
        transition: transform .2s ease-out;
        z-index: -1;
      }
      
      .open-modal:hover:after {
        transform: translate(0, 0);
      }
      
      .open-modal:active {
        background-color: #ffdeda;
        outline: 0;
      }
      
      .open-modal:hover {
        outline: 0;
      }
    
      </style>

      <button type="button" class="open-modal">
        Create Note
      </button>
    `;
  }
}

customElements.define("c-open-modal-button", OpenModalButton);
