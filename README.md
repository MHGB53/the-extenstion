# Arabic Keyboard Mapper for VS Code

A VS Code extension that maps QWERTY keyboard input to Arabic characters, simulating an Arabic keyboard layout.

## Features

- **Real-time Character Mapping**: As you type, English characters are automatically converted to their Arabic equivalents
- **Toggle Activation**: Use `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac) to switch between Arabic and English modes
- **Status Bar Indicator**: Visual indicator showing whether Arabic keyboard mode is active
- **Persistent State**: Your preference is saved and restored when VS Code restarts

## Keyboard Mapping

The extension maps QWERTY keys to standard Arabic keyboard layout:

### Main Rows:
- **Q Row**: ق ع ث ر ت ي و ن م ل
- **A Row**: ش س د ف ج ح ه خ ة ط
- **Z Row**: ز ع ج د ش س ي ب ل ا

## Installation

1. Copy this folder to your VS Code extensions directory
2. Or use `npm install` and `npm run esbuild` to build from source

## Usage

### Toggle Arabic Keyboard
- **Keyboard**: `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
- **Command**: Open Command Palette (`Ctrl+Shift+P`) and search for "Toggle Arabic Keyboard"

### Enable Arabic Keyboard
- **Command**: "Enable Arabic Keyboard" from Command Palette

### Disable Arabic Keyboard
- **Command**: "Disable Arabic Keyboard" from Command Palette

## Building

```bash
npm install
npm run esbuild
```

## Configuration

Add to your VS Code settings:

```json
{
  "arabicKeyboardMapper.enabled": true
}
```

## Example

When Arabic mode is **ON**:
```
Typing: "hello" → Displays as: "هلني"
Typing: "salam" → Displays as: "سلاي"
```

## Notes

- The mapping works in all text editors (code files, markdown, etc.)
- Diacritical marks (tashkeel) are included in the mapping
- Special characters and numbers also have Arabic equivalents

## License

MIT
