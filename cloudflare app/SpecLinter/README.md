# SpecLinter-cyrilkups - Figma Design Validation Plugin

A lightweight Figma plugin that helps Product Managers and Designers quickly identify when designs deviate from product requirements, platform standards, or accessibility guidelines.

## Features

✅ **Custom Rule Validation** - Define JSON-based rules for your specific design requirements  
✅ **Accessibility Checking** - WCAG compliance validation for color contrast and font sizes  
✅ **Interactive Results** - Click on failing elements to highlight them in Figma  
✅ **Design Scoring** - Get an overall compliance score for your designs  
✅ **Multiple Rule Types** - Font size, color contrast, required text, and more  
✅ **Clean Interface** - Professional UI that fits seamlessly into Figma  

## Installation

1. **Download the plugin files** from the `dist/` folder:
   - `code.js` - Main plugin logic
   - `ui.html` - User interface
   - `ui.js` - Interface functionality  
   - `manifest.json` - Plugin configuration

2. **Install in Figma Desktop**:
   - Open Figma Desktop application
   - Go to **Plugins** → **Development** → **Import plugin from manifest**
   - Select the `manifest.json` file from the `dist/` folder
   - The plugin will be installed and ready to use

3. **Alternative Installation**:
   - Zip the entire `dist/` folder
   - In Figma, go to **Plugins** → **Development** → **Import plugin from archive**
   - Upload the zip file

## Usage

### Loading Rules

1. **Default Rules**: Click "Load Default Rules" to start with common validation rules
2. **Custom Rules**: Paste your own JSON rules in the textarea
3. **Validate**: Click "Validate Rules" to check your rule syntax

### Example Rule Format

```json
[
  {
    "id": "min-font-size",
    "description": "Text must be at least 12px for readability",
    "type": "font-size",
    "condition": { "minSize": 12 }
  },
  {
    "id": "required-cta",
    "description": "Call-to-action button must be present",
    "type": "required-text",
    "condition": { "text": "button" }
  },
  {
    "id": "color-contrast",
    "description": "Text must meet WCAG AA contrast requirements",
    "type": "color-contrast",
    "condition": { "minContrast": 4.5 }
  }
]
```

### Scanning Designs

1. **Select Elements**: Choose frames, components, or individual elements in Figma
2. **Run Scan**: Click "Scan Selection" to validate against your rules
3. **Review Results**: See passed, warning, and error results with detailed feedback
4. **Fix Issues**: Click on failing elements to jump to them in Figma

## Supported Rule Types

| Type | Description | Condition Properties |
|------|-------------|---------------------|
| `font-size` | Validates text font sizes | `minSize`, `maxSize` |
| `required-text` | Checks for required text content | `text`, `caseSensitive` |
| `color-contrast` | Basic contrast validation | `minContrast` |

## Rule Condition Examples

### Font Size Validation
```json
{
  "type": "font-size",
  "condition": { 
    "minSize": 12,
    "maxSize": 72 
  }
}
```

### Required Text
```json
{
  "type": "required-text",
  "condition": { 
    "text": "Sign Up",
    "caseSensitive": false 
  }
}
```

### Color Contrast
```json
{
  "type": "color-contrast",
  "condition": { 
    "minContrast": 4.5 
  }
}
```

## Development

### Project Structure
```
├── dist/              # Built plugin files (ready for Figma)
├── code.ts           # Main plugin TypeScript source
├── ui.ts             # UI TypeScript source
├── ui.html           # UI HTML template
├── styles.css        # UI styling
├── manifest.json     # Plugin manifest
├── lintEngine.ts     # Rule validation engine
├── contrastCheck.ts  # Color contrast utilities
└── data/             # Example rules and templates
```

### Building from Source
```bash
# Install dependencies
npm install

# Compile TypeScript files to JavaScript
npx tsc code.ts --target es2017 --outDir dist
npx tsc ui.ts --target es2017 --outDir dist

# Copy HTML files
cp ui.html dist/
cp manifest.json dist/
```

## Contributing

This plugin is designed to be extensible. To add new rule types:

1. Add the rule logic to `lintEngine.ts`
2. Update the UI to handle the new rule type
3. Add example rules to the `data/` folder
4. Test thoroughly in Figma

## License

MIT License - Feel free to modify and distribute.

## Support

For issues, feature requests, or questions about custom rule creation, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for designers who care about quality and accessibility**