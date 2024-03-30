import {
  setLocalStorage,
  getLocalStorage,
  randomId,
  getCallback,
} from "../utils.js";

class Modal extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["open", "hide-overlay", "update-note-groups"];
  }

  get open() {
    return this.getAttribute("open");
  }

  set open(value) {
    this.setAttribute("open", value);
  }

  get hideOverlay() {
    return this.getAttribute("hide-overlay");
  }

  set hideOverlay(value) {
    this.setAttribute("hide-overlay", value);
  }

  get updateNoteGroups() {
    return this.getAttribute("update-note-groups");
  }

  set updateNoteGroups(value) {
    this.setAttribute("update-note-groups", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open" && this.open === "true") {
      this.render();
      this.bindEvents();
      this.assignCallbacks();
    }

    if (name === "open" && this.open === "false") {
      this.render();
    }
  }

  bindEvents() {
    this.cancelButton = this.root.querySelector(".cancel");
    this.confirmButton = this.root.querySelector(".confirm");

    this.cancelButton.addEventListener("click", () =>
      this.handleCancelButtonClick()
    );
    this.confirmButton.addEventListener("click", () =>
      this.handleConfirmButtonClick()
    );
  }

  assignCallbacks() {
    this.hideOverlayCallback = getCallback(this.hideOverlay);
    this.updateNoteGroupsCallback = getCallback(this.updateNoteGroups);
  }

  handleCancelButtonClick() {
    this.open = "false";
    this.hideOverlayCallback();
  }

  handleConfirmButtonClick() {
    this.titleInput = this.root.querySelector("#title");
    this.textarea = this.root.querySelector("#textarea");
    this.checkbox = this.root.querySelector(".checkbox");

    // Kirim data menggunakan fetch POST
    fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // id: randomId(),
        title: this.titleInput.value,
        body: this.textarea.value,
        // archived: this.checkbox.checked.toString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Server returned " + response.status + " " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
       
        console.log("Note added successfully:", data);

        this.notes = getLocalStorage("notesData");
        this.notes.push({
          id: randomId(),
          title: this.titleInput.value,
          body: this.textarea.value,
          archived: this.checkbox.checked.toString(),
        });
        setLocalStorage(this.notes);

        this.updateNoteGroupsCallback(this.notes);
        this.open = "false";
        this.hideOverlayCallback();
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  }

  render() {
    if (this.open !== "true") return (this.root.innerHTML = "");

    return (this.root.innerHTML = `
    <style>
    dialog {
      z-index: 9999;
      align-items: center;
      background-color: #fee6e3;
      border: 2px solid #111;
      border-radius: 8px;
      color: #111;
      font-family: Inter,sans-serif;
      font-size: 16px;
      justify-content: center;
      line-height: 24px;
      position: relative;
      text-align: center;
      
    }
  
    
  
    .dialog-message {
      padding: 1rem;
    }
  
    .dialog-buttons {
      padding: 1rem;
    }

    .cancel {
          appearance: button;
          background-color: transparent;
          background-image: linear-gradient(to bottom, #fff, #f8eedb);
          border: 0 solid #e5e7eb;
          border-radius: .5rem;
          box-sizing: border-box;
          color: #482307;
          column-gap: 1rem;
          cursor: pointer;
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
          box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
        }
        
        .cancel:active {
          background-color: #f3f4f6;
          box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
          transform: translateY(0.125rem);
        }
        
        .cancel:focus {
          box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
        }

    
        .confirm {
          appearance: button;
          background-color: transparent;
          background-image: linear-gradient(to bottom, #fff, #f8eedb);
          border: 0 solid #e5e7eb;
          border-radius: .5rem;
          box-sizing: border-box;
          color: #482307;
          column-gap: 1rem;
          cursor: pointer;
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
          
          box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
        }
        
        .confirm:active {
          background-color: #f3f4f6;
          box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
          transform: translateY(0.125rem);
        }
        
        .confirm:focus {
          box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
        }

    .field label,
    .field input,
    .textarea-field label,
    .textarea-field textarea {
      background-color: transparent;
      border: black;
    }


  </style>

      

      <section>
        <dialog class="dialog" id="dialog-rounded" open="">
          <div class="dialog-message">
            <div class="balloon">
              <p>Write down your notes or grievances here!</p>
            </div>
          </div>

          <div class="dialog-content">
            <div class="field">
              <label for="title">Title</label>
              <input type="text" id="title" class="input">
            </div>

            <div class="textarea-field">
              <label for="textarea">body</label>
              <textarea id="textarea" class="textarea"></textarea>
            </div>

            <div class="checkbox-field">
              <label>
                <input type="checkbox" class="checkbox" checked />
                <span>Pin</span>
              </label>
            </div>
          </div>

          <div class="dialog-buttons">
            <button class="cancel">Cancel</button>
            <button class="confirm">Confirm</button>
          </div>
        </dialog>
      </section>
      `);
  }
}

customElements.define("content-modal", Modal);
