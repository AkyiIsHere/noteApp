//state.js
import { isSmallScreen } from "./utils.js";

// --- STATE MANAGEMENT ---
// The single source of truth for the application
export const state = {
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
