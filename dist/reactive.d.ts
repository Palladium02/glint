type Cleanup = () => void;
type ReactiveEffect = {
    (): void;
    deps: Set<Set<ReactiveEffect>>;
    cleanups: Cleanup[];
};
export declare function createSignal<T>(value: T): [() => T, (v: T | ((prev: T) => T)) => void];
export declare function cleanup(effect: ReactiveEffect): void;
export declare function createEffect(fn: () => void): void;
export declare function onCleanup(fn: Cleanup): void;
export {};
