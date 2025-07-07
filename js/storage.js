// storage.js
import { config } from "./config.js";

// --- LOCALSTORAGE API ---
export const storageAPI = {
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
