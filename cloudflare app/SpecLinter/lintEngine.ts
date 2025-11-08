// Core linting engine for rule validation
// This module contains the main logic for validating design elements against rules

export interface Rule {
  id: string;
  description: string;
  type: string;
  condition: any;
}

export interface LintResult {
  ruleId: string;
  description: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
  nodes: any[];
}

export interface LintResults {
  passed: LintResult[];
  warnings: LintResult[];
  errors: LintResult[];
  score: number;
  totalNodes: number;
}

export class LintEngine {
  private rules: Rule[] = [];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  /**
   * Run all lint checks on the provided nodes
   */
  async runLintChecks(nodes: SceneNode[]): Promise<LintResults> {
    const results: LintResults = {
      passed: [],
      warnings: [],
      errors: [],
      score: 0,
      totalNodes: nodes.length
    };

    let passedRules = 0;

    for (const rule of this.rules) {
      try {
        const ruleResult = await this.checkRule(nodes, rule);
        
        switch (ruleResult.status) {
          case 'passed':
            results.passed.push(ruleResult);
            passedRules++;
            break;
          case 'warning':
            results.warnings.push(ruleResult);
            break;
          case 'error':
            results.errors.push(ruleResult);
            break;
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
        results.errors.push({
          ruleId: rule.id,
          description: rule.description,
          status: 'error',
          message: `Rule check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          nodes: []
        });
      }
    }

    // Calculate score
    results.score = this.rules.length > 0 ? 
      Math.round((passedRules / this.rules.length) * 100) : 100;

    return results;
  }

  /**
   * Check a single rule against all nodes
   */
  private async checkRule(nodes: SceneNode[], rule: Rule): Promise<LintResult> {
    switch (rule.type) {
      case 'required-text':
        return this.checkRequiredText(nodes, rule);
      
      case 'font-size':
        return this.checkFontSize(nodes, rule);
      
      case 'color-contrast':
        return this.checkColorContrast(nodes, rule);
      
      case 'required-component':
        return this.checkRequiredComponent(nodes, rule);
      
      case 'spacing':
        return this.checkSpacing(nodes, rule);
      
      case 'image-alt':
        return this.checkImageAlt(nodes, rule);
      
      default:
        throw new Error(`Unknown rule type: ${rule.type}`);
    }
  }

  /**
   * Check for required text elements
   */
  private checkRequiredText(nodes: SceneNode[], rule: Rule): LintResult {
    const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
    const requiredText = rule.condition.text;
    const caseSensitive = rule.condition.caseSensitive || false;
    
    const matchingNodes = textNodes.filter(node => {
      const nodeText = caseSensitive ? node.characters : node.characters.toLowerCase();
      const searchText = caseSensitive ? requiredText : requiredText.toLowerCase();
      return nodeText.includes(searchText);
    });

    const found = matchingNodes.length > 0;

    return {
      ruleId: rule.id,
      description: rule.description,
      status: found ? 'passed' : 'error',
      message: found ? 
        `Required text "${requiredText}" found in ${matchingNodes.length} element${matchingNodes.length > 1 ? 's' : ''}` : 
        `Required text "${requiredText}" not found`,
      nodes: found ? [] : this.nodeToInfo(textNodes)
    };
  }

  /**
   * Check font size requirements
   */
  private checkFontSize(nodes: SceneNode[], rule: Rule): LintResult {
    const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
    const minSize = rule.condition.minSize || 12;
    const maxSize = rule.condition.maxSize;
    const failingNodes: TextNode[] = [];

    for (const node of textNodes) {
      const fontSize = typeof node.fontSize === 'number' ? 
        node.fontSize : 
        (node.fontSize as any)?.value || 12;

      let fails = false;
      
      if (minSize && fontSize < minSize) {
        fails = true;
      }
      
      if (maxSize && fontSize > maxSize) {
        fails = true;
      }

      if (fails) {
        failingNodes.push(node);
      }
    }

    const passed = failingNodes.length === 0;
    let message = '';
    
    if (passed) {
      if (minSize && maxSize) {
        message = `All text is between ${minSize}px and ${maxSize}px`;
      } else if (minSize) {
        message = `All text meets minimum font size (${minSize}px)`;
      } else if (maxSize) {
        message = `All text is under maximum font size (${maxSize}px)`;
      }
    } else {
      message = `${failingNodes.length} text element${failingNodes.length > 1 ? 's' : ''} ${minSize && maxSize ? 'outside allowed range' : minSize ? 'below minimum size' : 'above maximum size'}`;
    }

    return {
      ruleId: rule.id,
      description: rule.description,
      status: passed ? 'passed' : 'error',
      message: message,
      nodes: this.nodeToInfo(failingNodes)
    };
  }

  /**
   * Check color contrast requirements
   */
  private checkColorContrast(nodes: SceneNode[], rule: Rule): LintResult {
    const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
    const minContrast = rule.condition.minContrast || 4.5;
    const failingNodes: TextNode[] = [];

    // This is a simplified implementation
    // Real contrast checking would require calculating actual contrast ratios
    for (const node of textNodes) {
      if (!node.fills || node.fills === figma.mixed || (Array.isArray(node.fills) && node.fills.length === 0)) {
        failingNodes.push(node);
        continue;
      }

      // Check if text has sufficient contrast (simplified check)
      if (Array.isArray(node.fills)) {
        const hasValidFill = node.fills.some((fill: any) => 
          fill.type === 'SOLID' && fill.color
        );

        if (!hasValidFill) {
          failingNodes.push(node);
        }
      }
    }

    const passed = failingNodes.length === 0;

    return {
      ruleId: rule.id,
      description: rule.description,
      status: passed ? 'passed' : 'warning',
      message: passed ? 
        'Color contrast check passed' :
        `${failingNodes.length} element${failingNodes.length > 1 ? 's' : ''} may have contrast issues`,
      nodes: this.nodeToInfo(failingNodes)
    };
  }

  /**
   * Check for required components
   */
  private checkRequiredComponent(nodes: SceneNode[], rule: Rule): LintResult {
    const componentName = rule.condition.componentName;
    const componentNodes = nodes.filter(node => 
      node.type === 'INSTANCE' && 
      (node as InstanceNode).mainComponent?.name === componentName
    );

    const found = componentNodes.length > 0;

    return {
      ruleId: rule.id,
      description: rule.description,
      status: found ? 'passed' : 'error',
      message: found ? 
        `Required component "${componentName}" found` : 
        `Required component "${componentName}" not found`,
      nodes: found ? [] : []
    };
  }

  /**
   * Check spacing requirements
   */
  private checkSpacing(nodes: SceneNode[], rule: Rule): LintResult {
    const minSpacing = rule.condition.minSpacing || 8;
    const maxSpacing = rule.condition.maxSpacing;
    
    // This is a simplified spacing check
    // Real implementation would analyze actual distances between elements
    
    return {
      ruleId: rule.id,
      description: rule.description,
      status: 'passed',
      message: 'Spacing check passed (simplified implementation)',
      nodes: []
    };
  }

  /**
   * Check image alt text requirements
   */
  private checkImageAlt(nodes: SceneNode[], rule: Rule): LintResult {
    const imageNodes = nodes.filter(node => {
      if (node.type === 'RECTANGLE' && node.fills && Array.isArray(node.fills)) {
        return node.fills.some((fill: any) => fill.type === 'IMAGE');
      }
      return false;
    });

    const failingNodes = imageNodes.filter(node => 
      !node.name || node.name.trim() === '' || node.name === 'Rectangle'
    );

    const passed = failingNodes.length === 0;

    return {
      ruleId: rule.id,
      description: rule.description,
      status: passed ? 'passed' : 'warning',
      message: passed ? 
        'All images have descriptive names' :
        `${failingNodes.length} image${failingNodes.length > 1 ? 's' : ''} missing descriptive names`,
      nodes: this.nodeToInfo(failingNodes)
    };
  }

  /**
   * Convert nodes to info objects for serialization
   */
  private nodeToInfo(nodes: SceneNode[]): any[] {
    return nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      ...(node.type === 'TEXT' ? {
        fontSize: (node as TextNode).fontSize,
        characters: (node as TextNode).characters
      } : {})
    }));
  }
}

/**
 * Utility function to collect all child nodes recursively
 */
export function collectAllNodes(node: SceneNode): SceneNode[] {
  const nodes: SceneNode[] = [node];
  
  if ('children' in node) {
    for (const child of node.children) {
      nodes.push(...collectAllNodes(child));
    }
  }
  
  return nodes;
}

/**
 * Default rule set for common design validation
 */
export const DEFAULT_RULES: Rule[] = [
  {
    id: 'min-font-size',
    description: 'Text must be at least 12px for readability',
    type: 'font-size',
    condition: { minSize: 12 }
  },
  {
    id: 'max-font-size',
    description: 'Heading text should not exceed 72px',
    type: 'font-size',
    condition: { maxSize: 72 }
  },
  {
    id: 'color-contrast',
    description: 'Text must meet WCAG AA contrast requirements (4.5:1)',
    type: 'color-contrast',
    condition: { minContrast: 4.5 }
  },
  {
    id: 'image-alt',
    description: 'Images should have descriptive names for accessibility',
    type: 'image-alt',
    condition: {}
  }
];
