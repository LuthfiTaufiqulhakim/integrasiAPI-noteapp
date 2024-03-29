document.addEventListener("DOMContentLoaded", () => {});

function updateNoteGroups(notesData) {
  const app = document.querySelector("container-app");
  const archivednotesData = app.shadowRoot.querySelector(
    'container-note-group[group="archived"]'
  );
  const unarchivednotesData = app.shadowRoot.querySelector(
    'container-note-group[group="unarchived"]'
  );
  const archivednotesDataCount = notesData.filter(
    (note) => note.archived === "true"
  ).length;
  const unarchivednotesDataCount = notesData.filter(
    (note) => note.archived === "false"
  ).length;

  archivednotesData.setAttribute("count", archivednotesDataCount);
  unarchivednotesData.setAttribute("count", unarchivednotesDataCount);
}

function openModal() {
  const app = document.querySelector("container-app");
  const modal = app.shadowRoot.querySelector("content-modal");
  const overlay = document.querySelector("content-overlay");

  modal.setAttribute("open", "true");
  overlay.setAttribute("is-modal-open", "true");
}

function hideOverlay() {
  const overlay = document.querySelector("content-overlay");
  overlay.setAttribute("is-modal-open", "false");
}
