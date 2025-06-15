type Context<T> = {
    id: symbol;
    defaultValue: T;
};
export declare function createContext<T>(defaultValue: T): Context<T>;
export declare function useContext<T>(ctx: Context<T>): T;
export declare function withContext<T>(ctx: Context<T>, value: T, children: () => Node): Node;
export {};
