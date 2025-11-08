# SpecLinter-cyrilkups UI Standards Rules

## Updated Validation Rules

Your SpecLitzer-cyrilkups plugin now includes comprehensive UI standards validation with 9 professional rules:

### 1. Primary Button Presence ❌ **Error**
- **Rule**: `req-primary-button`
- **Check**: Every screen must contain a clearly styled primary action button
- **Validates**: Component presence and clear primary actions

### 2. Text Contrast ❌ **Error** 
- **Rule**: `text-contrast`
- **Check**: Text elements must have minimum 4.5:1 contrast ratio
- **Validates**: WCAG AA accessibility compliance

### 3. Font Size Minimum ⚠️ **Warning**
- **Rule**: `font-size-min` 
- **Check**: Body text should be at least 14px for readability
- **Validates**: Typography accessibility standards

### 4. Touch Target Size ⚠️ **Warning**
- **Rule**: `tap-target-size`
- **Check**: Interactive elements must be at least 44x44 pixels
- **Validates**: Mobile accessibility and usability

### 5. Input Label Association ❌ **Error**
- **Rule**: `missing-label`
- **Check**: All input fields must have associated labels
- **Validates**: Form accessibility and usability

### 6. CTA Text Uniqueness ⚠️ **Warning**
- **Rule**: `duplicate-cta`
- **Check**: Avoid using same CTA text multiple times
- **Validates**: Clear user guidance and reduced confusion

### 7. Section Headers ⚠️ **Warning**
- **Rule**: `section-header-required`
- **Check**: Sections must include heading elements for clarity
- **Validates**: Content hierarchy and structure

### 8. Icon Alt Text ⚠️ **Warning**
- **Rule**: `icon-alt-text`
- **Check**: Icons and images must include alt text or labels
- **Validates**: Visual accessibility compliance

### 9. Button Alignment ⚠️ **Warning**
- **Rule**: `btn-alignment`
- **Check**: Primary action buttons should be aligned consistently
- **Validates**: Visual consistency and user expectations

## Rule Types Supported

| Type | Description | Examples |
|------|-------------|----------|
| `component-presence` | Checks for required UI components | Primary buttons, navigation |
| `color-contrast` | Validates text contrast ratios | WCAG compliance |
| `font-size` | Checks minimum font sizes | 14px body text |
| `element-size` | Validates touch target sizes | 44x44px minimum |
| `label-presence` | Checks for form labels | Input field associations |
| `text-uniqueness` | Validates unique CTA text | Avoid duplicate "Submit" |
| `heading-presence` | Checks for section headers | Page structure |
| `alt-text-presence` | Validates image accessibility | Icon descriptions |
| `element-alignment` | Checks layout consistency | Button positioning |

## Severity Levels

- **Error** ❌ - Critical issues that must be fixed
- **Warning** ⚠️ - Recommendations for better UX/accessibility

## How to Use

1. **Load Updated Rules**: Click "Load Default Rules" in the plugin
2. **Scan Your Design**: Select frames and click "Scan Selection"
3. **Review Results**: Get detailed feedback with error/warning categories
4. **Fix Issues**: Click on failing elements to highlight them in Figma

## Custom Rule Example

```json
{
  "id": "custom-brand-color",
  "description": "Use only approved brand colors",
  "type": "color-validation",
  "condition": { "allowed_colors": ["#FF6B6B", "#4ECDC4"] },
  "severity": "error"
}
```

Your plugin now provides comprehensive design validation covering accessibility, usability, and consistency standards!