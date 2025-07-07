// render.js
import { config } from "./config.js";
import { state } from "./state.js";
import { elements } from "./elements.js";
import { isSmallScreen, toggleClass } from "./utils.js";

// --- RENDER FUNCTION ---
//Render Navigation
const renderNav = () => {
  toggleClass(elements.navContainer, config.ACTIVE_CLASS, state.ui.isNavOpen);
  toggleClass(elements.nav, config.ACTIVE_CLASS, state.ui.isNavOpen);
  toggleClass(elements.arrIcon, config.ACTIVE_CLASS, state.ui.isNavOpen);
  elements.menuBtn.style.left = state.ui.isNavOpen
    ? `${elements.nav.offsetWidth}px`
    : "0";
};

//Render note list
const renderNoteList = () => {
  elements.navMenu.textContent = ""; // Clear existing list
  state.data.notes.forEach((note) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.id = note.id;
    a.className = "nav-link";
    a.textContent = isSmallScreen()
      ? note.title.slice(0, 10)
      : note.title.slice(0, 20);
    if (note.id === state.data.activeNodeId) {
      a.classList.add(config.ACTIVE_CLASS);
    }
    li.appendChild(a);
    elements.navMenu.appendChild(li);
  });
};

// Render active note display
const renderActiveNote = () => {
  const activeNote = state.data.notes.find(
    (note) => note.id === state.data.activeNodeId
  );

  if (activeNote) {
    const title = isSmallScreen()
      ? activeNote.title.slice(0, 20)
      : state.ui.isNavOpen
      ? activeNote.title.slice(0, 24)
      : activeNote.title.slice(0, 90);
    elements.noteTitle.textContent = title;
    elements.noteSubTitle.textContent = activeNote.title;
    elements.noteBody.textContent = activeNote.content;
  } else {
    elements.noteTitle.textContent = "Welcome";
    elements.noteSubTitle.textContent = "No note selected";
    elements.noteBody.textContent =
      "Select a note from the sidebar or create a new one.";
  }
};

// Render Form visibility and state
const renderForm = () => {
  toggleClass(
    elements.formContainer,
    config.OPEN_CLASS,
    state.ui.isFormVisible
  );
  elements.noteContainer.style.display = state.ui.isFormVisible
    ? "none"
    : "block";
  toggleClass(elements.submitBtn, "update-btn", state.ui.isEditing);
  toggleClass(elements.updateBtn, "submit-btn", !state.ui.isEditing);
  elements.submitBtn.textContent = state.ui.isEditing
    ? "Update Note"
    : "Add Note";
};

const renderBurgerBtn = () => {
  // Render Burger Btn
  toggleClass(
    elements.btnContainer,
    config.ACTIVE_CLASS,
    state.ui.isBurgerOpen
  );
};

// Updates the entire UI based on the current state
export const renderAll = () => {
  renderNav();
  renderNoteList();
  renderActiveNote();
  renderForm();
  renderBurgerBtn();
};
