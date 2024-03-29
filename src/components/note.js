import { getCallback, getLocalStorage, setLocalStorage } from "../utils.js";

class Note extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    this.notesData = getLocalStorage("notesData");
    this.handleArchivedButtonClick = this.handleArchivedButtonClick.bind(this);
    this.handleUnarchivedButtonClick =
      this.handleUnarchivedButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.render();
    this.assignCallbacks();

    this.archivedButtons = this.root.querySelectorAll("button.success");
    this.unarchivedButtons = this.root.querySelectorAll("button.unarchived");
    this.deleteButtons = this.root.querySelectorAll("button.error");
    this.bindEvents();
  }

  static get observedAttributes() {
    return ["id", "archived", "update-note-groups"];
  }

  get id() {
    return this.getAttribute("id");
  }

  get archived() {
    return this.getAttribute("archived");
  }

  set archived(value) {
    this.setAttribute("archived", value);

    this.updateNoteAndNoteGroups(this.id, { archived: value });

    this.updateButtonText();

    const updateCategory = value === "true" ? "archived" : "unarchived";
    this.updateNoteGroupsCallback(updateCategory);

    if (updateCategory === "unarchived") {
      this.handleUnarchivedButtonClick();
    }
  }

  updateButtonText() {
    const archivedButton = this.shadowRoot.querySelector("button.success");

    archivedButton.innerText = this.archived === "true" ? "" : "Archived";
  }

  get updateNoteGroups() {
    return this.getAttribute("update-note-groups");
  }

  set updateNoteGroups(value) {
    this.setAttribute("update-note-groups", value);
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "archived") this.updateButtonText();
  }

  assignCallbacks() {
    this.updateNoteGroupsCallback = getCallback(this.updateNoteGroups);
  }

  updateNoteAndNoteGroups = (id, attributes) => {
    const note = this.notesData.find((note) => note.id === id);
    Object.assign(note, attributes);
    setLocalStorage(this.notesData);

    this.updateNoteGroupsCallback(this.notesData);
  };

  handleArchivedButtonClick() {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${this.id}/archive`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Note archived:", data);
        this.archived = "true";
        

      })
      .catch((error) => {
        console.error("Error archiving note:", error);
        // Handle error, misalnya menampilkan pesan error kepada pengguna
      });
  }

  handleUnarchivedButtonClick() {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${this.id}/unarchive`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Note unarchived:", data);
        this.archived = "false";
      })
      .catch((error) => {
        console.error("Error unarchiving note:", error);
        // Handle error, misalnya menampilkan pesan error kepada pengguna
      });
  }

  handleDeleteButtonClick() {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${this.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Note deleted:", data);
        const noteIndex = this.notesData.findIndex(
          (note) => note.id === this.id
        );
        this.notesData.splice(noteIndex, 1);
        setLocalStorage(this.notesData);
        this.updateNoteGroupsCallback(this.notesData);
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        // Handle error, misalnya menampilkan pesan error kepada pengguna
      });
  }

  bindEvents() {
    this.archivedButtons.forEach((archivedButton) => {
      archivedButton.addEventListener("click", (e) => {
        this.handleArchivedButtonClick(e);
      });
    });

    this.unarchivedButtons.forEach((unarchivedButton) => {
      unarchivedButton.addEventListener("click", (e) => {
        this.handleUnarchivedButtonClick(e); // Tambahkan pemanggilan handleUnarchivedButtonClick
      });
    });

    this.deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        this.handleDeleteButtonClick(e);
      });
    });
  }

  render() {
    this.root.innerHTML = `
      <style>
      .container-note {
        align-items: center;
        background-color: #fee6e3;
        border: 2px solid #111;
        border-radius: 8px;
        box-sizing: border-box;
        color: #111;
        display: flex;
        font-family: Inter,sans-serif;
        font-size: 16px;
        justify-content: center;
        line-height: 24px;
        padding: 1rem ;
        position: relative;
        text-align: center;
        text-decoration: none;
      }
      

        .success {
          appearance: button;
          background-color: transparent;
          background-image: linear-gradient(to bottom, #fff, #f8eedb);
          border: 0 solid #e5e7eb;
          border-radius: .5rem;
          box-sizing: border-box;
          color: #482307;
          column-gap: 1rem;
          cursor: pointer;
          display: flex;
          font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
          font-size: 100%;
          font-weight: 700;
          line-height: 24px;
          margin: 0;
          outline: 2px solid transparent;
          padding: 5px 10px ;
          text-align: center;
          text-transform: none;
          transition: all .1s cubic-bezier(.4, 0, .2, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
        }
        
        .success:active {
          background-color: #f3f4f6;
          box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
          transform: translateY(0.125rem);
        }
        
        .success:focus {
          box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
        }

        .error {
          appearance: button;
          background-color: transparent;
          background-image: linear-gradient(to bottom, #fff, #f8eedb);
          border: 0 solid #e5e7eb;
          border-radius: .5rem;
          box-sizing: border-box;
          color: #482307;
          column-gap: 1rem;
          cursor: pointer;
          display: flex;
          font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
          font-size: 100%;
          font-weight: 700;
          line-height: 24px;
          margin-top: 10px;
          outline: 2px solid transparent;
          padding: 5px 10px ;
          text-align: center;
          text-transform: none;
          transition: all .1s cubic-bezier(.4, 0, .2, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
        }
        
        .error:active {
          background-color: #f3f4f6;
          box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
          transform: translateY(0.125rem);
        }
        
        .error:focus {
          box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
        }

        .unarchived {
          appearance: button;
          background-color: transparent;
          background-image: linear-gradient(to bottom, #fff, #f8eedb);
          border: 0 solid #e5e7eb;
          border-radius: .5rem;
          box-sizing: border-box;
          color: #482307;
          column-gap: 1rem;
          cursor: pointer;
          display: flex;
          font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
          font-size: 100%;
          font-weight: 700;
          line-height: 24px;
          margin-top: 10px;
          outline: 2px solid transparent;
          padding: 5px 10px ;
          text-align: center;
          text-transform: none;
          transition: all .1s cubic-bezier(.4, 0, .2, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
        }
        
        .unarchived:active {
          background-color: #f3f4f6;
          box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
          transform: translateY(0.125rem);
        }
        
        .unarchived:focus {
          box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
        }




      </style>

      <div class="container-note">
        <div class="container">
          <slot name="title"></slot>
          <slot name="body"></slot>

          <button type="button" class="success">Archived</button>
          <button type="button" class="unarchived">Unarchived</button>
          <button type="button" class="error">Delete</button>
        </div>
      </div>
    `;
  }
}
customElements.define("c-note", Note);
