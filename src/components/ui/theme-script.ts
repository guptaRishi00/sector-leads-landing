export const THEME_STORAGE_KEY = 'sl-theme';

export type ThemePreference = 'light' | 'dark' | 'system';

export const themeScript = `(function(){try{var t=window.localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
