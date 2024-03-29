class Header extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <style>

      header {
        display: grid;
        grid-template-columns: 1fr auto;  
        align-items: center;                 
        padding: 3rem 0;
      }
      
      h1 {
        color: #FEE6E3;
      }
      
      .r-element {
        
      }
      
      </style>

      <header>
        <div>
          <h1>Kampretin Note</h1>
        </div>

        <div class="r-element">
          <c-open-modal-button open-modal="openModal"></c-open-modal-button>
        </div>
      </header>
    `;
  }
}

customElements.define('container-header', Header)
