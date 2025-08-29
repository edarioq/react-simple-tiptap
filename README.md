# React Simple Tiptap

A powerful, lightweight rich text editor component for React applications. Built with Tiptap and featuring a clean, intuitive interface for creating and editing formatted content.

## Features

- 📝 Rich text formatting (bold, italic, underline, strikethrough)
- 📐 Text alignment (left, center, right, justify)
- 📋 Lists (bullet points, numbered lists)
- 🖼️ Image support with upload capabilities
- 🔗 Link management with popover interface
- 🎨 Text highlighting with color options
- ⚡ Keyboard shortcuts and hotkeys
- 📱 Mobile-responsive design
- 🎯 TypeScript support
- ♿ Accessibility features

## Installation

```bash
npm install simple-text-editor
```

### Peer Dependencies

Make sure you have React installed:

```bash
npm install react react-dom
```

## Usage

### Basic Usage

```tsx
import React, { useState } from "react";
import { ReactSimpleTiptap } from "simple-text-editor";

function App() {
  const [content, setContent] = useState("<p>Hello world!</p>");

  return <ReactSimpleTiptap value={content} onChange={setContent} />;
}
```

## Props

| Prop            | Type                              | Default               | Description                                   |
| --------------- | --------------------------------- | --------------------- | --------------------------------------------- |
| `value`         | `string`                          | `""`                  | HTML content of the editor                    |
| `onChange`      | `(content: string) => void`       | -                     | Callback fired when content changes           |

## Styling

Dark mode and light mode are supported out of the box. The editor also comes with default styles, but you can customize it by importing your own CSS.

## Keyboard Shortcuts

- **Bold**: `Cmd/Ctrl + B`
- **Italic**: `Cmd/Ctrl + I`
- **Underline**: `Cmd/Ctrl + U`
- **Link**: `Cmd/Ctrl + K`
- **Undo**: `Cmd/Ctrl + Z`
- **Redo**: `Cmd/Ctrl + Shift + Z`
- **Bullet List**: `Cmd/Ctrl + Shift + 8`
- **Ordered List**: `Cmd/Ctrl + Shift + 7`

## Development

### Setup

```bash
git clone <your-repo-url>
cd simple-text-editor
npm install
```

### Development Server

```bash
npm run dev
```

This starts a development server at `http://localhost:3001` where you can test the component.

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Credits

This editor is based on the [Tiptap Simple Editor Template](https://tiptap.dev/docs/ui-components/templates/simple-editor). Tiptap is an amazing headless editor built on top of ProseMirror.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on GitHub.
