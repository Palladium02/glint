const contextMapStack = [];
export function createContext(defaultValue) {
    return { id: Symbol(), defaultValue };
}
export function useContext(ctx) {
    for (let i = contextMapStack.length - 1; i >= 0; i--) {
        const map = contextMapStack[i];
        if (map.has(ctx.id)) {
            return map.get(ctx.id);
        }
    }
    return ctx.defaultValue;
}
export function withContext(ctx, value, children) {
    const map = new Map();
    map.set(ctx.id, value);
    contextMapStack.push(map);
    const result = children();
    contextMapStack.pop();
    return result;
}
