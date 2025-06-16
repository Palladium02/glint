**Glint** is a minimal, reactive, JSX-free frontend library inspired by Solid.
Write UI code that’s clear, composable, and expressive — without any build step overhead.

## Installation

```bash
npm install https://github.com/Palladium02/glint
```

## Example

```typescript
import { render, div, input, button, p, For, createSignal } from "glint";

function App() {
  const [todos, setTodos] = createSignal<string[]>([]);
  const [description, setDescription] = createSignal("");

  return div(
    input({
      value: () => description(),
      oninput: (event: InputEvent) => setDescription((event.target as HTMLInputElement).value),
    }),
    button({
      onclick: () => {
        setTodos([...todos, description()]);
        setDescription("");
      },
    }, "Add"),
    For(() => todos(), (todo) => p(todo))
  );
}

render(App(), document.body);

```
