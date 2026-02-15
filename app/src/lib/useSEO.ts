import { useEffect } from 'react';
import { siteConfig } from '@/lib/siteConfig';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
}

export function useSEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogUrl,
  ogType = 'website',
  ogImage = `${siteConfig.url}${siteConfig.ogImage}`,
  twitterCard = 'summary_large_image',
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    setMeta('description', description);
    setMeta('og:title', ogTitle || title);
    setMeta('og:description', ogDescription || description);
    setMeta('og:url', ogUrl || canonical);
    setMeta('og:type', ogType);
    setMeta('og:image', ogImage);
    setMeta('twitter:card', twitterCard);
    setMeta('twitter:title', ogTitle || title);
    setMeta('twitter:description', ogDescription || description);
    setMeta('twitter:image', ogImage);
    setLink('canonical', canonical);

    if (noIndex) {
      setMeta('robots', 'noindex');
    }

    return () => {
      document.title = `${siteConfig.name} — ${siteConfig.tagline}`;
      removeMeta('description');
      removeMeta('og:title');
      removeMeta('og:description');
      removeMeta('og:url');
      removeMeta('og:type');
      removeMeta('og:image');
      removeMeta('twitter:card');
      removeMeta('twitter:title');
      removeMeta('twitter:description');
      removeMeta('twitter:image');
      removeMeta('robots');
      removeLink('canonical');
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogUrl, ogType, ogImage, twitterCard, noIndex]);
}

function setMeta(name: string, content: string | undefined) {
  if (!content && name === 'description') content = siteConfig.description;
  if (!content) return;
  const attr = name.startsWith('og:') ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(name: string) {
  const attr = name.startsWith('og:') ? 'property' : 'name';
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
