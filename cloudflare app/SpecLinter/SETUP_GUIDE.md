# SpecLinter Installation & Setup Guide

## Step 1: Download Figma Desktop

**Important:** You MUST use Figma Desktop (not the web version) to install development plugins.

1. Go to https://www.figma.com/downloads/
2. Download and install Figma Desktop for your operating system
3. Sign in with your Figma account

## Step 2: Prepare Plugin Files

Your plugin files are ready in the `dist/` folder:
```
dist/
├── manifest.json     ← This is the file you'll select
├── code.js
├── ui.html
├── ui.js
└── styles.css
```

## Step 3: Install the Plugin

### In Figma Desktop:

1. **Open the Plugins menu**
   - Click on the "Plugins" tab in the top menu bar
   - OR use the keyboard shortcut: `Ctrl+/` (Windows) or `Cmd+/` (Mac)

2. **Go to Development section**
   - In the plugins panel, look for "Development" section at the bottom
   - Click on "Development"

3. **Import the plugin**
   - Click "Import plugin from manifest..."
   - A file dialog will open

4. **Select the manifest file**
   - Navigate to your project folder
   - Go into the `dist/` folder
   - Select `manifest.json`
   - Click "Open"

5. **Confirm installation**
   - You should see "SpecLinter" appear in your Development plugins list
   - If you see an error, check the troubleshooting section below

## Step 4: Use the Plugin

### First Time Setup:

1. **Create or open a Figma file**
   - You need some design elements to test with

2. **Select elements to scan**
   - Click and drag to select frames, text, or other elements
   - You can select multiple elements at once

3. **Run SpecLinter**
   - Go to Plugins → Development → SpecLinter
   - The plugin window will open

4. **Load rules and scan**
   - Click "Load Default Rules" to get started
   - Click "Scan Selection" to validate your design
   - View results and click on issues to highlight them

## Step 5: Understanding Results

### The plugin will show:
- **Green checkmarks** ✅ = Rules passed
- **Yellow warnings** ⚠️ = Minor issues
- **Red errors** ❌ = Critical problems
- **Overall score** = Percentage of rules passed

### Default Rules Check:
- Font sizes must be at least 12px
- Required text elements (like buttons)
- Basic color contrast validation

## Troubleshooting

### Plugin doesn't appear in menu:
- Make sure you're using Figma Desktop (not web)
- Try restarting Figma after installation
- Check that you selected the correct `manifest.json` file

### "Failed to import" error:
- Ensure all files are in the `dist/` folder
- Check that `manifest.json` is not corrupted
- Try downloading the project files again

### Plugin opens but won't scan:
- Make sure you have elements selected in Figma
- Try selecting different types of elements (text, frames, etc.)
- Check the browser console for error messages

### No rules loaded:
- Click "Load Default Rules" first
- Or paste custom rules in JSON format
- Click "Validate Rules" to check syntax

## Custom Rules

You can create your own validation rules using JSON format:

```json
[
  {
    "id": "brand-colors",
    "description": "Use only approved brand colors",
    "type": "color-validation",
    "condition": { "allowedColors": ["#FF0000", "#00FF00"] }
  }
]
```

## Next Steps

Once installed, you can:
- Create custom rule sets for your design system
- Use it in design reviews and handoffs
- Share the plugin with your team
- Integrate validation into your design workflow

---

**Need help?** Check that all 5 files are in your `dist/` folder and you're using Figma Desktop!