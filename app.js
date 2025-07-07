// -- IIFE (Immediate Invoke Function Expression) to avoid global population and improve encapsulation
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
    ui: {
      isNavOpen: !isSmallScreen(),
      isBurgerOpen: false,
      isFormVisible: false,
      isEditing: false,
    },
    data: {
      notes: [],
      activeNodeId: null,
    },
  };

  // --- LOCALSTORAGE API ---
  const storageAPI = {
    getAll: () => {
      try {
        return JSON.parse(localStorage.getItem(config.STORAGE_KEY)) || [];
      } catch (err) {
        console.warn("Failed to parse notes from localStorage:", err);
        return [];
      }
    },
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
  const render = () => {
    renderNav();
    renderNoteList();
    renderActiveNote();
    renderForm();
    renderBurgerBtn();
  };

  // --- ACTIONS & EVENT HANDLERS ---

  const setNavOpen = (isOpen) => {
    state.ui.isNavOpen = isOpen;
    render();

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
      render();

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

    render();
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

    render();

    // Auto-expand textarea after render
    // Setting height: auto; acts as a crucial "reset" or "unconstrain" step that forces the browser to re-evaluate and accurately calculate the scrollHeight based purely on the content, allowing it to shrink
    setTimeout(() => {
      elements.contentInput.style.height = config.AUTO_EXPAND_MIN_HEIGHT + "px";
      elements.contentInput.style.height = `${elements.contentInput.scrollHeight}px`;
    }, 0);
  };

  const closeForm = () => {
    state.ui.isFormVisible = false;
    render();
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
    openForm((isEditing = true), noteToEdit);
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

  function init() {
    addEventListeners();
    setupAutoExpand();
    state.data.notes = storageAPI.getAll();
    if (state.data.notes.length > 0) {
      state.data.activeNodeId = state.data.notes[0].id;
    }
    // document.addEventListener("click", (e) => console.log(e.target));
    render();
  }
  init();
})();
