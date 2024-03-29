export class Badge extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <style>
      .badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: bold;
        text-decoration: none;
        color: white;
      }

      .pin {
        color: yellow;
      } 

      .unpin {
        color: gray;
      }
      </style>

      
      `;
  }
}


customElements.define("c-badge", Badge);
