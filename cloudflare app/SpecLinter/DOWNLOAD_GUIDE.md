# How to Download Your SpecLinter Plugin Files

## Option 1: Download Individual Files (Recommended)

Since you're working on Replit, you need to download the plugin files to your computer:

### Step 1: Download Each File
Right-click on each file in the `dist/` folder and select "Download":

1. **manifest.json** - Plugin configuration file
2. **code.js** - Main plugin logic  
3. **ui.html** - User interface
4. **ui.js** - Interface functionality
5. **styles.css** - Styling

### Step 2: Create Local Folder
On your computer, create a new folder called `SpecLinter` and put all 5 files inside.

### Step 3: Install in Figma
- Open Figma Desktop
- Go to Plugins → Development → Import plugin from manifest
- Select the `manifest.json` file from your local folder

## Option 2: Download as ZIP (Alternative)

If Replit allows, you can download the entire `dist/` folder as a ZIP file:
1. Right-click on the `dist/` folder
2. Select "Download as ZIP" (if available)
3. Extract the ZIP on your computer
4. Use the extracted `manifest.json` file to install

## What You Need on Your Computer:

```
Your Computer:
└── SpecLinter/               ← Create this folder
    ├── manifest.json         ← Download from Replit
    ├── code.js              ← Download from Replit  
    ├── ui.html              ← Download from Replit
    ├── ui.js                ← Download from Replit
    └── styles.css           ← Download from Replit
```

## File Locations in Replit:

All files are ready in your Replit project under the `dist/` folder:
- dist/manifest.json
- dist/code.js  
- dist/ui.html
- dist/ui.js
- dist/styles.css

## After Downloading:

1. **Install Figma Desktop** (not web version)
2. **Open Figma Desktop**
3. **Press Ctrl+/** (Windows) or **Cmd+/** (Mac)
4. **Click "Development"** at bottom of plugins panel
5. **Click "Import plugin from manifest..."**
6. **Select your downloaded manifest.json file**
7. **Start using SpecLinter!**

The plugin works completely offline once installed - no internet connection needed for validation.