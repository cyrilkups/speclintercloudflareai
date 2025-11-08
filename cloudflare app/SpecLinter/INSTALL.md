# SpecLinter Installation Guide

## Quick Install

Your SpecLinter Figma plugin is ready! Follow these simple steps:

### Step 1: Open Figma Desktop
- Launch the Figma desktop application (not web browser)
- You need the desktop version to install development plugins

### Step 2: Install the Plugin
1. In Figma, go to **Plugins** → **Development** → **Import plugin from manifest**
2. Navigate to your project folder and select: `dist/manifest.json`
3. Click **Open**

The plugin will now appear in your **Plugins** → **Development** menu!

### Step 3: Start Using SpecLinter
1. Select some frames or elements in your Figma design
2. Go to **Plugins** → **Development** → **SpecLinter**
3. Click "Load Default Rules" to get started
4. Click "Scan Selection" to validate your design

## What's Included

✅ **All files ready in `dist/` folder:**
- `manifest.json` - Plugin configuration
- `code.js` - Main plugin logic (244 lines)
- `ui.html` - User interface (104 lines)
- `ui.js` - Interface functionality (420 lines)
- `styles.css` - Professional styling (520 lines)

## Default Rules

The plugin comes with these built-in validation rules:
- **Font Size**: Text must be at least 12px for readability
- **Required Elements**: Check for call-to-action buttons
- **Color Contrast**: Basic WCAG compliance checking

## Custom Rules

You can create your own validation rules using JSON format. See the main README for examples.

## Troubleshooting

**Plugin not appearing?**
- Make sure you're using Figma Desktop (not web)
- Check that all files are in the `dist/` folder
- Try restarting Figma after installation

**Having issues?**
- All plugin files are plain JavaScript - no compilation needed
- Check the Figma console for any error messages
- Make sure you've selected elements before scanning

---

**Your plugin is production-ready and includes 1,305 lines of carefully crafted code!**