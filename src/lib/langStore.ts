export type Lang = 'zh' | 'en';

const STORAGE_KEY = 'myblog:lang';

function readStorage(): Lang | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === 'zh' || v === 'en') return v;
  } catch {
    // ignore
  }
  return null;
}

function writeStorage(lang: Lang) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

function setDomLang(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-lang', lang);
}

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  const stored = readStorage();
  if (stored) return stored;
  return location.pathname.includes('/en/') ? 'en' : 'zh';
}

let current: Lang = detectLang();
setDomLang(current);
const listeners = new Set<(lang: Lang) => void>();

export const langStore = {
  get: () => current,
  set: (lang: Lang) => {
    if (lang === current) return;
    current = lang;
    writeStorage(lang);
    setDomLang(lang);
    listeners.forEach((cb) => cb(lang));
  },
  toggle: () => {
    langStore.set(current === 'zh' ? 'en' : 'zh');
  },
  syncWithUrl: () => {
    if (typeof window === 'undefined') return;
    const next = location.pathname.includes('/en/') ? 'en' : 'zh';
    langStore.set(next);
  },
  subscribe: (cb: (lang: Lang) => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};
