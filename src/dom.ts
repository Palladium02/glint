import { createEffect } from "./reactive";

type Props = {
  [key: string]: any;
  [key: `on${string}`]: (e: Event) => void | undefined;
};

// type Child = Node | string | number | (() => string | number) | Child[];

export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K) {
  return (...args: any[]): HTMLElementTagNameMap[K] => {
    const el = document.createElement(tag);

    let props: Props = {} as Props;
    if (
      typeof args[0] === "object" &&
      !Array.isArray(args[0]) &&
      !(args[0] instanceof Node) &&
      args[0] !== null
    ) {
      props = args.shift();
    }

    for (const [key, val] of Object.entries(props)) {
      if (key.startsWith("on") && typeof val === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (typeof val === "function") {
        createEffect(() => {
          const value = val();
          if (key in el) {
            (el as any)[key] = value;
          } else {
            el.setAttribute(key, String(value));
          }
        });
      } else {
        el.setAttribute(key, String(val));
      }
    }

    for (const child of args.flat()) {
      if (typeof child === "function") {
        const text = document.createTextNode("");
        el.appendChild(text);
        createEffect(() => {
          text.textContent = String(child());
        });
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else if (child != null) {
        el.appendChild(document.createTextNode(String(child)));
      }
    }

    return el;
  };
}

export const div = createElement("div");
export const p = createElement("p");
export const button = createElement("button");
export const input = createElement("input");

export function Show(condition: () => boolean, child: Node): Comment {
  const placeholder = document.createComment("Show");

  queueMicrotask(() => {
    const parent = placeholder.parentNode;
    if (!parent) return;

    let mounted = false;

    createEffect(() => {
      const shouldShow = condition();

      if (shouldShow && !mounted) {
        parent.insertBefore(child, placeholder.nextSibling);
        mounted = true;
      } else if (!shouldShow && mounted) {
        if (child.parentNode === parent) parent.removeChild(child);
        mounted = false;
      }
    });
  });

  return placeholder;
}

export function For<T>(
  items: () => T[],
  renderItem: (item: T) => Node,
): Comment {
  const placeholder = document.createComment("For");

  queueMicrotask(() => {
    const parent = placeholder.parentNode;
    if (!parent) return;

    let children: Node[] = [];

    createEffect(() => {
      for (const node of children) {
        if (node.parentNode === parent) parent.removeChild(node);
      }

      const newItems = items();
      children = newItems.map(renderItem);

      for (const node of children) {
        parent.insertBefore(node, placeholder.nextSibling);
      }
    });
  });

  return placeholder;
}
