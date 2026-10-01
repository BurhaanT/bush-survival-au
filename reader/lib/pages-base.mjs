const safePath = /^\/[A-Za-z0-9._/-]*\/$/;

export function normalisePagesBase(value = '/') {
  let base = String(value || '/').trim();
  if (!base.startsWith('/')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  base = base.replace(/\/{2,}/g, '/');
  if (base === '/') return '/';
  if (!safePath.test(base) || base.includes('/../') || base.includes('/./') || base.includes('\\') || base.includes('\0')) {
    throw new Error('GitHub Pages base must be a safe absolute URL path.');
  }
  return base;
}

export function resolvePagesBase({ explicit = '', repository = '' } = {}) {
  if (String(explicit).trim()) return normalisePagesBase(explicit);
  const [owner, name, ...extra] = String(repository).split('/');
  if (!owner || !name || extra.length) return '/';
  if (name.toLowerCase() === `${owner}.github.io`.toLowerCase()) return '/';
  return normalisePagesBase('/' + name + '/');
}
