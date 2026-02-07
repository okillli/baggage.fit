import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogUrl?: string;
}

export function useSEO({ title, description, canonical, ogTitle, ogUrl }: SEOProps) {
  useEffect(() => {
    document.title = title;

    setMeta('description', description);
    setMeta('og:title', ogTitle || title);
    setMeta('og:url', ogUrl || canonical);
    setLink('canonical', canonical);

    return () => {
      document.title = 'baggage.fit — Free Airline Bag Size Checker';
      removeMeta('description');
      removeMeta('og:title');
      removeMeta('og:url');
      removeLink('canonical');
    };
  }, [title, description, canonical, ogTitle, ogUrl]);
}

function setMeta(name: string, content: string | undefined) {
  if (!content) return;
  const isOg = name.startsWith('og:');
  const attr = isOg ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(name: string) {
  const isOg = name.startsWith('og:');
  const attr = isOg ? 'property' : 'name';
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
}

function setLink(rel: string, href: string | undefined) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeLink(rel: string) {
  document.querySelector(`link[rel="${rel}"]`)?.remove();
}
