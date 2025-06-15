type Cleanup = () => void;

let currentEffect: ReactiveEffect | null = null;
let currentCleanups: Cleanup[] = [];

type ReactiveEffect = {
  (): void;
  deps: Set<Set<ReactiveEffect>>;
  cleanups: Cleanup[];
};

export function createSignal<T>(
  value: T,
): [() => T, (v: T | ((prev: T) => T)) => void] {
  const subscribers = new Set<ReactiveEffect>();

  const read = () => {
    if (currentEffect) {
      subscribers.add(currentEffect);
      currentEffect.deps.add(subscribers);
    }
    return value;
  };

  const write = (newValue: T | ((prev: T) => T)) => {
    const next =
      typeof newValue === "function"
        ? (newValue as (prev: T) => T)(value)
        : newValue;
    if (Object.is(value, next)) return;
    value = next;
    for (const sub of [...subscribers]) sub();
  };

  return [read, write];
}

export function cleanup(effect: ReactiveEffect) {
  for (const dep of effect.deps) dep.delete(effect);
  effect.deps.clear();
  for (const fn of effect.cleanups) fn();
  effect.cleanups = [];
}

export function createEffect(fn: () => void) {
  const effect: ReactiveEffect = () => {
    cleanup(effect);
    currentEffect = effect;
    currentCleanups = [];
    try {
      fn();
    } finally {
      effect.cleanups = currentCleanups;
      currentEffect = null;
      currentCleanups = [];
    }
  };
  effect.deps = new Set();
  effect.cleanups = [];
  effect();
}

export function onCleanup(fn: Cleanup) {
  if (currentEffect) {
    currentCleanups.push(fn);
  }
}
