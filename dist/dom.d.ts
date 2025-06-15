export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K): (...args: any[]) => HTMLElementTagNameMap[K];
export declare const div: (...args: any[]) => HTMLDivElement;
export declare const p: (...args: any[]) => HTMLParagraphElement;
export declare const button: (...args: any[]) => HTMLButtonElement;
export declare const input: (...args: any[]) => HTMLInputElement;
export declare function Show(condition: () => boolean, child: Node): Comment;
export declare function For<T>(items: () => T[], renderItem: (item: T) => Node): Comment;
