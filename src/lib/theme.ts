export const THEME_STORAGE_KEY = "aipex-theme";

// Runs in <head> before the page paints, so a saved light choice never
// flashes dark first. Dark is the default.
export const themeScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
