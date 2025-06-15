type Context<T> = {
  id: symbol;
  defaultValue: T;
};

const contextMapStack: Map<symbol, unknown>[] = [];

export function createContext<T>(defaultValue: T): Context<T> {
  return { id: Symbol(), defaultValue };
}

export function useContext<T>(ctx: Context<T>): T {
  for (let i = contextMapStack.length - 1; i >= 0; i--) {
    const map = contextMapStack[i];
    if (map.has(ctx.id)) {
      return map.get(ctx.id) as T;
    }
  }
  return ctx.defaultValue;
}

export function withContext<T>(
  ctx: Context<T>,
  value: T,
  children: () => Node,
): Node {
  const map = new Map<symbol, unknown>();
  map.set(ctx.id, value);
  contextMapStack.push(map);
  const result = children();
  contextMapStack.pop();
  return result;
}
