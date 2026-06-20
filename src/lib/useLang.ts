import { useEffect, useState } from 'react';
import { langStore, type Lang } from './langStore';

export function useLang() {
  const [lang, setLang] = useState<Lang>(langStore.get());
  useEffect(() => langStore.subscribe(setLang), []);
  return [lang, langStore.set, langStore.toggle] as const;
}
