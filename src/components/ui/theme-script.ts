export const THEME_STORAGE_KEY = 'sl-theme';

export type ThemePreference = 'light' | 'dark' | 'system';

// Light is the default: with no saved choice the page stays light. "dark" and "system" are saved
// and set as data-theme; theme.css only follows the OS under data-theme="system".
export const themeScript = `(function(){try{var t=window.localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||t==='system'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
