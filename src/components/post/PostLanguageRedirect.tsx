import { useCallback, useEffect, useRef } from 'react';
import { useLang } from '@/lib/useLang';

interface PostLanguageRedirectProps {
  pageLang: 'zh' | 'en';
  slug: string;
  translationHref?: string;
}

declare global {
  interface Window {
    __navigate?: (href: string) => void;
  }
}

export function PostLanguageRedirect({
  pageLang,
  slug,
  translationHref,
}: PostLanguageRedirectProps) {
  const [lang, setLang] = useLang();
  const initialized = useRef(false);

  const isOnThisArticle = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return location.pathname.includes(`/posts/${pageLang}/${slug}`);
  }, [pageLang, slug]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (lang !== pageLang) {
        setLang(pageLang);
      }
      return;
    }

    if (lang !== pageLang && translationHref && isOnThisArticle()) {
      const navigate = window.__navigate;
      if (navigate) navigate(translationHref);
      else location.assign(translationHref);
    }
  }, [lang, pageLang, slug, translationHref, setLang, isOnThisArticle]);

  return null;
}
