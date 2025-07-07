//utils.js
import { config } from "./config.js";

// -- UTILITY FUNCTIONS ---
/**
 * Checks whether the screen size is small or not.
 * @returns - Boolean.
 */
export function isSmallScreen() {
  return window.innerWidth <= config.SMALL_SCREEN_BREAKPOINT;
}

/**
 * Toggles a class on an element.
 * @param {HTMLElement} el - The element.
 * @param {string} className - The class to toggle.
 * @param {boolean} className - Optional. If true, adds the class; if false, removes it.
 */
export const toggleClass = (el, className, force) =>
  el?.classList.toggle(className, force);
