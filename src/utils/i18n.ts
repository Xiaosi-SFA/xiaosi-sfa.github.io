const langFiles = import.meta.glob('../content/lang/*.lang', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parseLang(raw: string) {
  const map: Record<string, string> = {};
  if (!raw) return map;
  raw.split(/\r?\n/).forEach((line) => {
    const s = line.trim();
    if (!s || s.startsWith('#') || s.startsWith('//')) return;
    const eq = s.indexOf('=');
    if (eq === -1) return;
    const k = s.slice(0, eq).trim();
    const v = s.slice(eq + 1).trim();
    if (k) map[k] = v;
  });
  return map;
}

const locales: Record<string, Record<string, string>> = {};
for (const [p, content] of Object.entries(langFiles)) {
  const match = p.match(/\/([a-z0-9_-]+)\.lang$/i);
  if (match) {
    locales[match[1].toLowerCase()] = parseLang(content);
  }
}

export function getI18n(urlOrPath: URL | string) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const pathname = typeof urlOrPath === 'string' ? urlOrPath : urlOrPath.pathname;
  const pathNoBase = (cleanBase !== '/' && pathname.startsWith(cleanBase))
    ? '/' + pathname.slice(cleanBase.length)
    : pathname;

  const m = pathNoBase.match(/^\/(?<lc>[a-z]{2}(?:-[a-z]{2})?)(?:\/|$)/i);
  const currentLocale = (m?.groups?.lc || 'zh-cn').toLowerCase();
  const isEn = currentLocale === 'en';
  const localePrefix = isEn ? '/en' : '';
  const pathNoLocale = pathNoBase.replace(/^\/[a-z]{2}(?:-[a-z]{2})?(?=\/|$)/i, '') || '/';
  const isHomeNormalized = pathNoLocale === '/';

  const M_CUR = locales[currentLocale] || locales['zh-cn'] || {};
  const M_EN = locales['en'] || {};
  const M_ZH = locales['zh-cn'] || {};

  function t(key: string, fallback?: string): string {
    return M_CUR[key] ?? (isEn ? (M_EN[key] ?? fallback ?? key) : (M_ZH[key] ?? fallback ?? key));
  }

  return {
    currentLocale,
    isEn,
    localePrefix,
    pathNoLocale,
    isHomeNormalized,
    t,
  };
}
