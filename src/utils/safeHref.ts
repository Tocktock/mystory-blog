const SAFE_EXTERNAL_PROTOCOLS = new Set(['https:', 'mailto:']);

export function isSafeHref(href: string): boolean {
  if (href.startsWith('/') || href.startsWith('#')) {
    return true;
  }

  try {
    const url = new URL(href);
    return SAFE_EXTERNAL_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}
