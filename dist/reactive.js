let currentEffect = null;
let currentCleanups = [];
export function createSignal(value) {
    const subscribers = new Set();
    const read = () => {
        if (currentEffect) {
            subscribers.add(currentEffect);
            currentEffect.deps.add(subscribers);
        }
        return value;
    };
    const write = (newValue) => {
        const next = typeof newValue === "function"
            ? newValue(value)
            : newValue;
        if (Object.is(value, next))
            return;
        value = next;
        for (const sub of [...subscribers])
            sub();
    };
    return [read, write];
}
export function cleanup(effect) {
    for (const dep of effect.deps)
        dep.delete(effect);
    effect.deps.clear();
    for (const fn of effect.cleanups)
        fn();
    effect.cleanups = [];
}
export function createEffect(fn) {
    const effect = () => {
        cleanup(effect);
        currentEffect = effect;
        currentCleanups = [];
        try {
            fn();
        }
        finally {
            effect.cleanups = currentCleanups;
            currentEffect = null;
            currentCleanups = [];
        }
    };
    effect.deps = new Set();
    effect.cleanups = [];
    effect();
}
export function onCleanup(fn) {
    if (currentEffect) {
        currentCleanups.push(fn);
    }
}
