// handlers.js
import { config } from "./config.js";
import { elements } from "./elements.js";
import { state } from "./state.js";
import { isSmallScreen } from "./utils.js";
import { renderAll } from "./render.js";
import { storageAPI } from "./storage.js";

// --- ACTIONS & EVENT HANDLERS ---

const setNavOpen = (isOpen) => {
  state.ui.isNavOpen = isOpen;
  renderAll();

  state.ui.isNavOpen
    ? document.addEventListener("click", clickOutsideHandler)
    : document.removeEventListener("click", clickOutsideHandler);
};

const clickOutsideHandler = (e) => {
  const clickedOutside =
    !elements.nav.contains(e.target) &&
    e.target !== elements.menuBtn &&
    e.target !== elements.arrIcon;

  if (isSmallScreen() && clickedOutside) {
    setNavOpen(!state.ui.isNavOpen);
  }
};

const setBurgerOpen = (isOpen) => {
  if (isSmallScreen()) {
    state.ui.isBurgerOpen = isOpen;
    renderAll();

    state.ui.isBurgerOpen
      ? document.addEventListener("click", closeBurgerHandler)
      : document.removeEventListener("click", closeBurgerHandler);
  }
};

const closeBurgerHandler = (e) => {
  const clickedOutside =
    !elements.btnContainer.contains(e.target) &&
    e.target !== elements.burgerBtn;

  if (clickedOutside && !state.ui.isNavOpen) {
    setBurgerOpen(false);
  }
};

const handleNavClick = (e) => {
  e.stopPropagation();
  const link = e.target.closest(".nav-link");

  if (link) {
    e.preventDefault();
    state.data.activeNodeId = Number(link.dataset.id);
    state.ui.isFormVisible = false;
    state.ui.isBurgerOpen = false;

    if (isSmallScreen()) {
      setNavOpen(false);
    }
  }

  renderAll();
};

const openForm = (isEditing = false, note = null) => {
  state.ui.isFormVisible = true;
  state.ui.isEditing = isEditing;
  // !isEditing && (state.data.activeNodeId = null);

  if (isEditing && note) {
    elements.titleInput.value = note.title;
    elements.contentInput.value = note.content;
    //cause scrollHeight can be calculated only after rendering
    // elements.contentInput.style.height =
    //   elements.contentInput.scrollHeight + "px";
  } else {
    elements.form.reset();
    elements.contentInput.style.height = config.AUTO_EXPAND_MIN_HEIGHT + "px";
  }

  if (isSmallScreen()) {
    setNavOpen(false);
  }

  renderAll();

  // Auto-expand textarea after render
  // Setting height: auto; acts as a crucial "reset" or "unconstrain" step that forces the browser to re-evaluate and accurately calculate the scrollHeight based purely on the content, allowing it to shrink
  setTimeout(() => {
    elements.contentInput.style.height = config.AUTO_EXPAND_MIN_HEIGHT + "px";
    elements.contentInput.style.height = `${elements.contentInput.scrollHeight}px`;
  }, 0);
};

const closeForm = () => {
  state.ui.isFormVisible = false;
  renderAll();
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const noteForm = new FormData(e.target);
  const title = noteForm.get("note-title").trim();
  const content = noteForm.get("note-content").trim();

  if (state.ui.isEditing) {
    //Update existing note
    const noteIndex = state.data.notes.findIndex(
      (n) => n.id === state.data.activeNodeId
    );
    if (noteIndex > -1) {
      state.data.notes[noteIndex] = {
        ...state.data.notes[noteIndex],
        title,
        content,
      };
    }
  } else {
    const newNote = { id: Date.now(), title, content };
    state.data.notes.push(newNote);
    state.data.activeNodeId = newNote.id;
  }

  storageAPI.saveAll(state.data.notes);
  closeForm();
};

const handleEditClick = () => {
  if (!state.data.activeNodeId) {
    alert("Please select a note to edit.");
    return;
  }
  const noteToEdit = state.data.notes.find(
    (n) => n.id === state.data.activeNodeId
  );
  openForm(true, noteToEdit);
};

const handleDeleteClick = () => {
  if (!state.data.activeNodeId) {
    alert("Please select a note to delete.");
    return;
  }
  if (confirm("Are you sure you want to delete this note?")) {
    state.data.notes = state.data.notes.filter(
      (n) => n.id !== state.data.activeNodeId
    );
    state.data.activeNodeId =
      state.data.notes.length > 0 ? state.data.notes[0].id : null;
    storageAPI.saveAll(state.data.notes);
    renderAll();
  }
};

// --- auto expand feature ---
const setupAutoExpand = () => {
  elements.autoExpandInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.style.height = `${config.AUTO_EXPAND_MIN_HEIGHT}px`;
      if (input.scrollHeight >= config.AUTO_EXPAND_MIN_HEIGHT) {
        input.style.height = `${input.scrollHeight}px`;
      }
    });
  });
};

// --- EVENT LISTENERS ---

const addEventListeners = () => {
  elements.menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setNavOpen(!state.ui.isNavOpen);
  });
  elements.newBtn.addEventListener("click", () => openForm());
  elements.cancelBtn.addEventListener("click", closeForm);
  elements.form.addEventListener("submit", handleFormSubmit);
  elements.noteEditBtn.addEventListener("click", handleEditClick);
  elements.noteDeleteBtn.addEventListener("click", handleDeleteClick);
  elements.navMenu.addEventListener("click", handleNavClick);
  elements.burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setBurgerOpen(!state.ui.isBurgerOpen);
  });
};

export { setupAutoExpand, addEventListeners };
