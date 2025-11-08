// Main plugin code that runs in the Figma sandbox
// This communicates with the UI and handles Figma API interactions

figma.showUI(__html__, { 
  width: 320, 
  height: 500,
  themeColors: true 
});

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  console.log('Received message:', msg);

  switch (msg.type) {
    case 'scan-selection':
      await handleScanSelection(msg.rules);
      break;
    
    case 'highlight-node':
      await handleHighlightNode(msg.nodeId);
      break;
    
    case 'get-selection':
      handleGetSelection();
      break;
    
    case 'close':
      figma.closePlugin();
      break;
    
    default:
      console.warn('Unknown message type:', msg.type);
  }
};

// Handle scanning the current selection
async function handleScanSelection(rules: any[]) {
  try {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.ui.postMessage({
        type: 'scan-error',
        message: 'Please select at least one frame or element to scan.'
      });
      return;
    }

    console.log(`Scanning ${selection.length} selected elements...`);
    
    // Collect all nodes to scan (including children)
    const nodesToScan: SceneNode[] = [];
    
    for (const node of selection) {
      nodesToScan.push(node);
      if ('children' in node) {
        collectChildNodes(node, nodesToScan);
      }
    }

    console.log(`Total nodes to scan: ${nodesToScan.length}`);

    // Run lint checks
    const results = await runLintChecks(nodesToScan, rules);
    
    // Send results back to UI
    figma.ui.postMessage({
      type: 'scan-complete',
      results: results,
      totalNodes: nodesToScan.length
    });

  } catch (error) {
    console.error('Scan error:', error);
    figma.ui.postMessage({
      type: 'scan-error',
      message: `Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Recursively collect all child nodes
function collectChildNodes(node: any, collector: SceneNode[]) {
  if ('children' in node) {
    for (const child of node.children) {
      collector.push(child);
      collectChildNodes(child, collector);
    }
  }
}

// Run lint checks on collected nodes
async function runLintChecks(nodes: SceneNode[], rules: any[]) {
  const results: {
    passed: any[];
    warnings: any[];
    errors: any[];
    score: number;
  } = {
    passed: [],
    warnings: [],
    errors: [],
    score: 0
  };

  let totalRules = rules.length;
  let passedRules = 0;

  for (const rule of rules) {
    try {
      const ruleResult = await checkRule(nodes, rule);
      
      if (ruleResult.status === 'passed') {
        results.passed.push(ruleResult);
        passedRules++;
      } else if (ruleResult.status === 'warning') {
        results.warnings.push(ruleResult);
      } else {
        results.errors.push(ruleResult);
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
  results.score = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 100;

  return results;
}

// Check individual rule against nodes
async function checkRule(nodes: SceneNode[], rule: any) {
  const failingNodes = [];
  
  switch (rule.type) {
    case 'required-text':
      return checkRequiredText(nodes, rule);
    
    case 'font-size':
      return checkFontSize(nodes, rule);
    
    case 'color-contrast':
      return checkColorContrast(nodes, rule);
    
    default:
      throw new Error(`Unknown rule type: ${rule.type}`);
  }
}

// Check for required text elements
function checkRequiredText(nodes: SceneNode[], rule: any) {
  const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
  const requiredText = rule.condition.text;
  const found = textNodes.some(node => 
    node.characters.toLowerCase().includes(requiredText.toLowerCase())
  );

  return {
    ruleId: rule.id,
    description: rule.description,
    status: found ? 'passed' : 'error',
    message: found ? 
      `Required text "${requiredText}" found` : 
      `Required text "${requiredText}" not found`,
    nodes: found ? [] : textNodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type
    }))
  };
}

// Check font size requirements
function checkFontSize(nodes: SceneNode[], rule: any) {
  const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
  const minSize = rule.condition.minSize || 12;
  const failingNodes = [];

  for (const node of textNodes) {
    const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
    if (fontSize < minSize) {
      failingNodes.push({
        id: node.id,
        name: node.name,
        type: node.type,
        fontSize: fontSize
      });
    }
  }

  return {
    ruleId: rule.id,
    description: rule.description,
    status: failingNodes.length === 0 ? 'passed' : 'error',
    message: failingNodes.length === 0 ? 
      `All text meets minimum font size (${minSize}px)` :
      `${failingNodes.length} text elements below minimum font size`,
    nodes: failingNodes
  };
}

// Check color contrast (simplified version)
function checkColorContrast(nodes: SceneNode[], rule: any) {
  const textNodes = nodes.filter(node => node.type === 'TEXT') as TextNode[];
  const minContrast = rule.condition.minContrast || 4.5;
  const failingNodes = [];

  // This is a simplified implementation
  // In a real scenario, you'd need to calculate actual contrast ratios
  for (const node of textNodes) {
    // For now, we'll just check if the text has fills
    if (!node.fills || node.fills === figma.mixed || (Array.isArray(node.fills) && node.fills.length === 0)) {
      failingNodes.push({
        id: node.id,
        name: node.name,
        type: node.type,
        issue: 'No text color defined'
      });
    }
  }

  return {
    ruleId: rule.id,
    description: rule.description,
    status: failingNodes.length === 0 ? 'passed' : 'warning',
    message: failingNodes.length === 0 ? 
      'Color contrast check passed' :
      `${failingNodes.length} elements may have contrast issues`,
    nodes: failingNodes
  };
}

// Handle highlighting a specific node
async function handleHighlightNode(nodeId: string) {
  try {
    const node = figma.getNodeById(nodeId);
    if (node) {
      figma.currentPage.selection = [node as SceneNode];
      figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      
      figma.ui.postMessage({
        type: 'node-highlighted',
        nodeId: nodeId
      });
    } else {
      figma.ui.postMessage({
        type: 'highlight-error',
        message: 'Node not found'
      });
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'highlight-error',
      message: `Failed to highlight node: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Handle getting current selection info
function handleGetSelection() {
  const selection = figma.currentPage.selection;
  
  figma.ui.postMessage({
    type: 'selection-info',
    count: selection.length,
    nodes: selection.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type
    }))
  });
}

// Initialize plugin
console.log('SpecLinter plugin initialized');
figma.ui.postMessage({
  type: 'plugin-ready'
});
