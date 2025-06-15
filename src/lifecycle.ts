export function onMount(fn: () => void) {
  queueMicrotask(() => {
    fn();
  });
}
