  export default function maxReady() {
  const w = window as any;
  const fn = w?.WebApp?.ready;
  if (typeof fn === 'function') {
    try {
      fn();
    } catch {}
  }
}
