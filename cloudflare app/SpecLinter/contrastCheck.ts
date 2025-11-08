// Color contrast checking utilities for WCAG compliance
// Implements color contrast ratio calculations and validation

export interface ContrastResult {
  ratio: number;
  passes: {
    AA: boolean;
    AAA: boolean;
    AALarge: boolean;
    AAALarge: boolean;
  };
  foreground: string;
  background: string;
}

export class ContrastChecker {
  
  /**
   * Calculate contrast ratio between two colors
   * @param foreground - Foreground color (text)
   * @param background - Background color
   * @returns Contrast ratio (1:1 to 21:1)
   */
  static calculateContrastRatio(foreground: RGB, background: RGB): number {
    const fgLuminance = this.calculateLuminance(foreground);
    const bgLuminance = this.calculateLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance of a color
   * Based on WCAG 2.1 guidelines
   */
  private static calculateLuminance(color: RGB): number {
    const { r, g, b } = color;
    
    // Convert to sRGB
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    // Apply gamma correction
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    // Calculate luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Check if contrast ratio meets WCAG standards
   */
  static checkContrastCompliance(ratio: number, isLargeText: boolean = false): ContrastResult['passes'] {
    return {
      AA: ratio >= (isLargeText ? 3.0 : 4.5),
      AAA: ratio >= (isLargeText ? 4.5 : 7.0),
      AALarge: ratio >= 3.0,
      AAALarge: ratio >= 4.5
    };
  }

  /**
   * Analyze contrast for a Figma text node
   */
  static analyzeTextNodeContrast(textNode: TextNode): ContrastResult | null {
    try {
      // Get text color
      const textColor = this.extractColorFromFills(textNode.fills);
      if (!textColor) {
        return null;
      }

      // Get background color (simplified - from parent or default)
      const backgroundColor = this.getBackgroundColor(textNode);
      
      const ratio = this.calculateContrastRatio(textColor, backgroundColor);
      const isLargeText = this.isLargeText(textNode);
      const passes = this.checkContrastCompliance(ratio, isLargeText);

      return {
        ratio: Math.round(ratio * 100) / 100,
        passes,
        foreground: this.rgbToHex(textColor),
        background: this.rgbToHex(backgroundColor)
      };

    } catch (error) {
      console.error('Error analyzing text contrast:', error);
      return null;
    }
  }

  /**
   * Extract RGB color from Figma fills
   */
  private static extractColorFromFills(fills: readonly Paint[] | typeof figma.mixed): RGB | null {
    if (!fills || fills === figma.mixed || !Array.isArray(fills)) {
      return null;
    }

    // Find first solid color fill
    const solidFill = fills.find(fill => fill.type === 'SOLID') as SolidPaint;
    if (!solidFill || !solidFill.color) {
      return null;
    }

    return {
      r: Math.round(solidFill.color.r * 255),
      g: Math.round(solidFill.color.g * 255),
      b: Math.round(solidFill.color.b * 255)
    };
  }

  /**
   * Get background color for a text node (simplified implementation)
   */
  private static getBackgroundColor(textNode: TextNode): RGB {
    // Simplified: try to get parent background or default to white
    let parent = textNode.parent;
    
    while (parent) {
      if ('fills' in parent && parent.fills && parent.fills !== figma.mixed) {
        const parentColor = this.extractColorFromFills(parent.fills);
        if (parentColor) {
          return parentColor;
        }
      }
      parent = parent.parent;
    }
    
    // Default to white background
    return { r: 255, g: 255, b: 255 };
  }

  /**
   * Determine if text qualifies as "large text" for WCAG
   */
  private static isLargeText(textNode: TextNode): boolean {
    const fontSize = typeof textNode.fontSize === 'number' ? 
      textNode.fontSize : 
      (textNode.fontSize as any)?.value || 14;

    const fontWeight = typeof textNode.fontWeight === 'number' ? textNode.fontWeight : 400;
    
    // WCAG definition:
    // Large text is 18pt+ or 14pt+ bold
    // 1pt = 1.33px approximately
    const ptSize = fontSize / 1.33;
    
    return ptSize >= 18 || (ptSize >= 14 && fontWeight >= 700);
  }

  /**
   * Convert RGB to hex string
   */
  private static rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Convert hex string to RGB
   */
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Get contrast ratio grade as string
   */
  static getContrastGrade(passes: ContrastResult['passes'], isLargeText: boolean = false): string {
    if (isLargeText) {
      if (passes.AAALarge) return 'AAA';
      if (passes.AALarge) return 'AA';
      return 'Fail';
    } else {
      if (passes.AAA) return 'AAA';
      if (passes.AA) return 'AA';
      return 'Fail';
    }
  }

  /**
   * Generate suggestions to improve contrast
   */
  static generateContrastSuggestions(result: ContrastResult, isLargeText: boolean = false): string[] {
    const suggestions: string[] = [];
    const targetRatio = isLargeText ? 3.0 : 4.5;
    
    if (result.ratio < targetRatio) {
      suggestions.push(`Current contrast ratio is ${result.ratio}:1, needs to be at least ${targetRatio}:1`);
      
      if (result.ratio < 2.0) {
        suggestions.push('Consider using significantly different colors');
      } else {
        suggestions.push('Try darkening the text color or lightening the background');
        suggestions.push('Alternatively, lighten the text color or darken the background');
      }
      
      if (isLargeText) {
        suggestions.push('For large text, you only need 3:1 ratio');
      } else {
        suggestions.push('Consider making text larger (18pt+) to lower contrast requirements');
      }
    }
    
    return suggestions;
  }
}

// Type definitions
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// WCAG contrast thresholds
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5
} as const;

// Utility functions for common use cases
export function quickContrastCheck(foregroundHex: string, backgroundHex: string): number {
  const fg = ContrastChecker.hexToRgb(foregroundHex);
  const bg = ContrastChecker.hexToRgb(backgroundHex);
  
  if (!fg || !bg) {
    throw new Error('Invalid hex color format');
  }
  
  return ContrastChecker.calculateContrastRatio(fg, bg);
}

export function meetsWCAG_AA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return contrastRatio >= (isLargeText ? WCAG_THRESHOLDS.AA_LARGE : WCAG_THRESHOLDS.AA_NORMAL);
}

export function meetsWCAG_AAA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return contrastRatio >= (isLargeText ? WCAG_THRESHOLDS.AAA_LARGE : WCAG_THRESHOLDS.AAA_NORMAL);
}
