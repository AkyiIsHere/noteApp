// --- DOM Element Selections ---
export const elements = {
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
