import "./script.js";
import "./style/style.css";

import "./components/header.js";
import "./components/Badge.js";
import "./components/Modal.js";
import "./components/NoteGroup.js";
import "./components/OpenModalButton.js";
import "./components/Overlay.js";
import "./components/note.js";


import { notesData } from "../src/data.js";
import { getLocalStorage, setLocalStorage } from "../src/utils.js";

class MainApp extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    this.notesData = getLocalStorage("notesData") || null;
  }

  connectedCallback() {
    if (!this.notesData) {
      setLocalStorage(notesData);
      this.notesData = notesData;
    }

    this.archivednotesDataCount = this.notesData.filter(
      (note) => note.archived === "true"
    ).length;
    this.unarchivednotesDataCount = this.notesData.filter(
      (note) => note.archived === "false"
    ).length;

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <style>

        :host {
          display: block;
          max-width: 1114px;
          margin: 0 auto 4rem;
          padding: 0 1rem;
        }

        .app {
          display: grid;
          grid-template-columns: 1fr;  
          grid-gap: 1rem;          
        }
        
        
        .container-note {
          display: grid;
          grid-template-columns: repeat(2, 1fr); 
          grid-gap: 1rem;                        
        }
        
        .c-archived,
        .c-unarchived {
          display: flex;
          flex-direction: column;
          align-items: center;  
        }
        
        .c-archived h2,
        .c-unarchived h2 {
          margin-bottom: 0.5rem; 
          color: #FEE6E3;
        }
       
      </style>

      <div class="app">
        <container-header></container-header>
        <content-modal
          open="false"
          update-note-groups="updateNoteGroups"
          hide-overlay="hideOverlay"
        ></content-modal>
        <div class="container-note">
        
       <div class =c-archived>
       <h2>Archived</h2>
       <container-note-group count="${this.archivednotesDataCount}" group="archived"></container-note-group>
       </div>
       <div class =c-unarchived>
       <h2>Unarchived</h2>
       <container-note-group count="${this.unarchivednotesDataCount}" group="unarchived"></container-note-group>
       </div>
       
        
        
        
        </div>
      </div>
      `;
  }
}

customElements.define("container-app", MainApp);
