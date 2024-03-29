import { getLocalStorage } from '../utils.js';
class NoteGroup extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.notesData = getLocalStorage('notesData');
    this.render();
  }

  static get observedAttributes() {
    return ['count', 'group'];
  }

  get group() {
    return this.getAttribute('group');
  }

  get count() {
    return this.getAttribute('count');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'count') {
      this.notesData = getLocalStorage('notesData');
      this.render();
    }
  }

  rendernotesData(notesData, group) {
    let isarchived = group === 'archived';
    let filterednotesData = notesData.filter(note => note.archived === isarchived.toString());
    let content = '';

    for (let note of filterednotesData) {
      content += `
        <c-note id="${note.id}" archived="${note.archived}" update-note-groups="updateNoteGroups">
          <h3 slot="title">${note.title}</h3>
          <p slot="body">${note.body}</p>
        </c-note>
      `;
    }

    return content;
  };

  render() {
    if (!parseInt(this.count)) return this.root.innerHTML = '';

    return this.root.innerHTML = `
      <style>

          :host {
            display: block;
          }

          .note-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  
            margin-top: 1rem;
            margin-bottom: 3rem;
            gap: 1rem;
            
          }

          
      </style>

      <section>
        <a href="#" class="badge">
          <container-badge type="${this.group}"></container-badge>
        </a>
        <div class="note-group">
          ${this.rendernotesData(this.notesData, this.group)}
        </div>
      </section>
      `;
  }
}

customElements.define('container-note-group', NoteGroup)
