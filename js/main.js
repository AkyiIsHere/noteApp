// main.js
import { state } from "./state.js";
import { storageAPI } from "./storage.js";
import { addEventListeners, setupAutoExpand } from "./handlers.js";
import { renderAll } from "./render.js";

function init() {
  state.data.notes = storageAPI.getAll();
  if (state.data.notes.length > 0) {
    state.data.activeNodeId = state.data.notes[0].id;
  }

  addEventListeners();
  setupAutoExpand();
  renderAll();
}

init();
