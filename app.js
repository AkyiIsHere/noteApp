// -- IIFE (Immediate Invoke Function Expressin) to avoid global population and improve encapsulation
(function () {
  // --- CONFIG & CONSTANTS ---
  const config = {
    STORAGE_KEY: "note-data",
    SMALL_SCREEN_BREAKPOINT: 426, // Breakpoint for small screens
    AUTO_EXPAND_MIN_HEIGHT: 200, // min height for auto-expand textareas
    ACTIVE_CLASS: "active",
    OPEN_CLASS: "open",
  };

  // --- DOM Element Selections ---
  const elements = {
    //SideNav
    navContainer: document.querySelector(".nav-container"),
    nav: document.getElementById("nav"),
    navMenu: document.getElementById("nav-menu"),
    menuBtn: document.getElementById("menuBtn"),
    arrIcon: document.querySelector(".arr-icon"),

    // Main Content
    noteContainer: document.querySelector(".note-container"),
    noteTitle: document.getElementById("note-title"),
    noteSubTitle: document.getElementById("sub-title"),
    noteBody: document.getElementById("note-body"),

    //Form
    formContainer: document.querySelector(".form-container"),
    form: document.querySelector("#note-form"),
    titleInput: document.getElementById("note-title-input"),
    contentInput: document.getElementById("note-content-input"),
    autoExpandInputs: document.querySelectorAll(".auto-expand"),

    //FormBtn
    submitBtn: document.getElementById("submit-btn"),
    cancelBtn: document.getElementById("cancel-btn"),

    //Note Btn
    newBtn: document.querySelector(".new-btn"),
    noteEditBtn: document.getElementById("note-edit"),
    noteDeleteBtn: document.getElementById("note-delete"),

    burgerBtn: document.querySelector(".burger-btn"),
    btnContainer: document.querySelector(".btn-container"),
  };

  // --- STATE MANAGEMENT ---
  // The single source of truth for the application
  const state = {
    notes: [],
    activeNodeId: null,
    isNavOpen: !isSmallScreen(),
    isBurgerOpen: false,
    isFormVisible: false,
    isEditing: false,
  };

  // --- LOCALSTORAGE API ---
  const storageAPI = {
    getAll: () => JSON.parse(localStorage.getItem(config.STORAGE_KEY)) || [],
    saveAll: (notes) =>
      localStorage.setItem(config.STORAGE_KEY, JSON.stringify(notes)),
  };

  // -- UTILITY FUNCTIONS ---
  /**
   * Checks whether the screen size is small or not.
   * @returns - Boolean.
   */
  function isSmallScreen() {
    return window.innerWidth <= config.SMALL_SCREEN_BREAKPOINT;
  }

  /**
   * Toggles a class on an element.
   * @param {HTMLElement} el - The element.
   * @param {string} className - The class to toggle.
   * @param {boolean} className - Optional. If true, adds the class; if false, removes it.
   */
  const toggleClass = (el, className, force) =>
    el?.classList.toggle(className, force);

  // --- RENDER FUNCTION ---
  // Updates the entire UI based on the current state
  const render = () => {
    //Render navigation
    toggleClass(elements.navContainer, config.ACTIVE_CLASS, state.isNavOpen);
    toggleClass(elements.nav, config.ACTIVE_CLASS, state.isNavOpen);
    toggleClass(elements.arrIcon, config.ACTIVE_CLASS, state.isNavOpen);
    elements.menuBtn.style.left = state.isNavOpen
      ? `${elements.nav.offsetWidth}px`
      : "0";

    //Render note list
    elements.navMenu.textContent = ""; // Clear existing list
    state.notes.forEach((note) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.id = note.id;
      a.className = "nav-link";
      a.textContent = isSmallScreen()
        ? note.title.slice(0, 10)
        : note.title.slice(0, 20);
      if (note.id === state.activeNodeId) {
        a.classList.add(config.ACTIVE_CLASS);
      }
      li.appendChild(a);
      elements.navMenu.appendChild(li);
    });

    // Render active note display
    const activeNote = state.notes.find(
      (note) => note.id === state.activeNodeId
    );

    if (activeNote) {
      const title = isSmallScreen()
        ? activeNote.title.slice(0, 20)
        : state.isNavOpen
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

    // Render Form visibility and state
    toggleClass(elements.formContainer, config.OPEN_CLASS, state.isFormVisible);
    elements.noteContainer.style.display = state.isFormVisible
      ? "none"
      : "block";
    toggleClass(elements.submitBtn, "update-btn", state.isEditing);
    toggleClass(elements.updateBtn, "submit-btn", !state.isEditing);
    elements.submitBtn.textContent = state.isEditing
      ? "Update Note"
      : "Add Note";

    // Render Burger Btn
    toggleClass(elements.btnContainer, config.ACTIVE_CLASS, state.isBurgerOpen);
  };

  // --- ACTIONS & EVENT HANDLERS ---

  const setNavOpen = (isOpen) => {
    state.isNavOpen = isOpen;
    render();
    // console.log("setNavOpen");

    state.isNavOpen
      ? document.addEventListener("click", clickOutsideHandler)
      : document.removeEventListener("click", clickOutsideHandler);
  };

  const clickOutsideHandler = (e) => {
    const clickedOutside =
      !elements.nav.contains(e.target) &&
      e.target !== elements.menuBtn &&
      e.target !== elements.arrIcon;

    if (isSmallScreen() && clickedOutside) {
      setNavOpen(!state.isNavOpen);
    }
  };

  const setBurgerOpen = (isOpen) => {
    if (isSmallScreen()) {
      state.isBurgerOpen = isOpen;
      render();

      state.isBurgerOpen
        ? document.addEventListener("click", closeBrugerHandler)
        : document.removeEventListener("click", closeBrugerHandler);
    }
  };

  const closeBrugerHandler = (e) => {
    const clickedOutside =
      !elements.btnContainer.contains(e.target) &&
      e.target !== elements.burgerBtn;

    if (clickedOutside && !state.isNavOpen) {
      setBurgerOpen(false);
    }
  };

  const handleNavClick = (e) => {
    e.stopPropagation();
    const link = e.target.closest(".nav-link");

    if (link) {
      e.preventDefault();
      state.activeNodeId = Number(link.dataset.id);
      state.isFormVisible = false;
      state.isBurgerOpen = false;

      if (isSmallScreen()) {
        state.isNavOpen = false;
      }
    }

    render();
  };

  const openForm = (isEditing = false, note = null) => {
    state.isFormVisible = true;
    state.isEditing = isEditing;
    !isEditing && (state.activeNodeId = null);

    if (isEditing && note) {
      elements.titleInput.value = note.title;
      elements.contentInput.value = note.content;
      //cause scrollHeight can be calculated after rendering
      // elements.contentInput.style.height =
      //   elements.contentInput.scrollHeight + "px";
    } else {
      elements.form.reset();
      elements.contentInput.style.height = config.AUTO_EXPAND_MIN_HEIGHT + "px";
    }

    if (isSmallScreen()) {
      state.isNavOpen = false;
    }

    render();

    // Auto-expand textarea after render
    // Setting height: auto; acts as a crucial "reset" or "unconstrain" step that forces the browser to re-evaluate and accurately calculate the scrollHeight based purely on the content, allowing it to shrink
    setTimeout(() => {
      elements.contentInput.style.height = config.AUTO_EXPAND_MIN_HEIGHT + "px";
      elements.contentInput.style.height = `${elements.contentInput.scrollHeight}px`;
    }, 0);
  };

  const closeForm = () => {
    state.isFormVisible = false;
    render();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const noteForm = new FormData(e.target);
    const title = noteForm.get("note-title").trim();
    const content = noteForm.get("note-content").trim();

    if (state.isEditing) {
      //Updaet existing note
      const noteIndex = state.notes.findIndex(
        (n) => n.id === state.activeNodeId
      );
      if (noteIndex > -1) {
        state.notes[noteIndex] = { ...state.notes[noteIndex], title, content };
      }
    } else {
      const newNote = { id: Date.now(), title, content };
      state.notes.push(newNote);
      state.activeNodeId = newNote.id;
    }

    storageAPI.saveAll(state.notes);
    closeForm();
  };

  const handleEditClick = () => {
    if (!state.activeNodeId) {
      alert("Please select a note to edit.");
      return;
    }
    const noteToEdit = state.notes.find((n) => n.id === state.activeNodeId);
    openForm((isEditing = true), noteToEdit);
  };

  const handleDeleteClick = () => {
    if (!state.activeNodeId) {
      alert("Please select a note to delete.");
      return;
    }
    if (confirm("Are you sure you want to delete this note?")) {
      state.notes = state.notes.filter((n) => n.id !== state.activeNodeId);
      state.activeNodeId = state.notes.length > 0 ? state.notes[0].id : null;
      storageAPI.saveAll(state.notes);
      render();
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
      setNavOpen(!state.isNavOpen);
    });
    elements.newBtn.addEventListener("click", () => openForm());
    elements.cancelBtn.addEventListener("click", closeForm);
    elements.form.addEventListener("submit", handleFormSubmit);
    elements.noteEditBtn.addEventListener("click", handleEditClick);
    elements.noteDeleteBtn.addEventListener("click", handleDeleteClick);
    elements.navMenu.addEventListener("click", handleNavClick);
    elements.burgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setBurgerOpen(!state.isBurgerOpen);
    });
  };

  function init() {
    addEventListeners();
    setupAutoExpand();
    state.notes = storageAPI.getAll();
    if (state.notes.length > 0) {
      state.activeNodeId = state.notes[0].id;
    }
    // document.addEventListener("click", (e) => console.log(e.target));
    render();
  }
  init();
})();
