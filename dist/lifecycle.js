export function onMount(fn) {
    queueMicrotask(() => {
        fn();
    });
}
