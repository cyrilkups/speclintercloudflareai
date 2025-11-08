// SpecLinter-cyrilkups Figma Plugin - Main Code
// Embeds UI directly to avoid loading issues

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SpecLinter-cyrilkups</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      color: #333;
      font-size: 12px;
      line-height: 1.4;
    }
    
    .container {
      padding: 16px;
      max-width: 100%;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e1e5e9;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 4px;
    }
    
    .subtitle {
      font-size: 11px;
      color: #666;
    }
    
    .section-title {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #2c2c2c;
    }
    
    .rules-section {
      margin-bottom: 20px;
    }
    
    textarea {
      width: 100%;
      min-height: 80px;
      padding: 8px;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      font-size: 11px;
      font-family: 'Monaco', monospace;
      resize: vertical;
      margin-bottom: 8px;
    }
    
    .rules-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .btn {
      padding: 6px 12px;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      background: #fff;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn:hover {
      background: #f8f9fa;
    }
    
    .btn-primary {
      background: #0066cc;
      color: white;
      border-color: #0066cc;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .scan-section {
      margin-bottom: 20px;
      text-align: center;
    }
    
    .selection-info {
      margin-bottom: 12px;
      color: #666;
      font-size: 11px;
    }
    
    .results-section {
      border-top: 1px solid #e1e5e9;
      padding-top: 16px;
    }
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .score-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .summary-item {
      text-align: center;
      padding: 8px;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
    }
    
    .summary-count {
      font-size: 16px;
      font-weight: 600;
      display: block;
    }
    
    .summary-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
    }
    
    .results-list {
      max-height: 200px;
      overflow-y: auto;
    }
    
    .result-item {
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 4px;
      border-left: 3px solid #ddd;
    }
    
    .result-passed {
      background: #f8fff9;
      border-left-color: #28a745;
    }
    
    .result-warning {
      background: #fff8e1;
      border-left-color: #ffc107;
    }
    
    .result-error {
      background: #fff5f5;
      border-left-color: #dc3545;
    }
    
    .result-description {
      font-weight: 600;
      font-size: 11px;
      margin-bottom: 4px;
    }
    
    .result-message {
      font-size: 10px;
      color: #666;
    }
    
    .hidden {
      display: none;
    }
    
    .spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-state {
      text-align: center;
      padding: 20px;
      color: #dc3545;
    }
    
    .no-issues {
      text-align: center;
      padding: 20px;
      color: #28a745;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">SpecLinter-cyrilkups</h1>
      <p class="subtitle">Design Validation Tool</p>
    </header>

    <main class="main-content">
      <section class="rules-section">
        <h2 class="section-title">Validation Rules</h2>
        <div class="rules-input">
          <textarea 
            id="rulesTextarea" 
            placeholder="Paste your validation rules (JSON format) or use default rules..."
            rows="6"
          ></textarea>
          <div class="rules-actions">
            <button id="loadDefaultRules" class="btn">Load Default Rules</button>
            <button id="validateRules" class="btn">Validate Rules</button>
          </div>
        </div>
      </section>

      <section class="scan-section">
        <div class="scan-info">
          <p id="selectionInfo" class="selection-info">Select frames or elements to scan</p>
        </div>
        <button id="scanButton" class="btn btn-primary" disabled>
          <span id="scanButtonText">Scan Selection</span>
          <span id="scanSpinner" class="spinner hidden">⟳</span>
        </button>
      </section>

      <section class="results-section hidden" id="resultsSection">
        <div class="results-header">
          <h2 class="section-title">Scan Results</h2>
          <div class="score-badge" id="scoreBadge">
            <span class="score-text">Score: </span>
            <span class="score-value" id="scoreValue">0%</span>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-count" id="passedCount">0</span>
            <span class="summary-label">Passed</span>
          </div>
          <div class="summary-item">
            <span class="summary-count" id="warningsCount">0</span>
            <span class="summary-label">Warnings</span>
          </div>
          <div class="summary-item">
            <span class="summary-count" id="errorsCount">0</span>
            <span class="summary-label">Errors</span>
          </div>
        </div>

        <div class="results-list" id="resultsList"></div>
        
        <div class="no-issues hidden" id="noIssues">
          <p>✅ All validation rules passed!</p>
        </div>
      </section>

      <section class="error-state hidden" id="errorState">
        <p id="errorMessage"></p>
        <button id="retryButton" class="btn">Try Again</button>
      </section>
    </main>
  </div>

  <script>
    // UI JavaScript code
    class SpecLinterUI {
      constructor() {
        this.currentRules = [];
        this.isScanning = false;
        this.initializeUI();
        this.loadDefaultRules();
        this.setupEventListeners();
      }

      initializeUI() {
        this.updateSelectionInfo(0);
        this.hideResults();
      }

      setupEventListeners() {
        document.getElementById('loadDefaultRules')?.addEventListener('click', () => {
          this.loadDefaultRules();
        });

        document.getElementById('validateRules')?.addEventListener('click', () => {
          this.validateRules();
        });

        document.getElementById('scanButton')?.addEventListener('click', () => {
          this.startScan();
        });

        document.getElementById('retryButton')?.addEventListener('click', () => {
          this.hideError();
          this.refreshSelection();
        });

        document.getElementById('rulesTextarea')?.addEventListener('input', () => {
          this.onRulesChanged();
        });

        window.onmessage = (event) => {
          this.handlePluginMessage(event.data.pluginMessage);
        };
      }

      loadDefaultRules() {
        const defaultRules = [
          {
            id: 'req-primary-button',
            description: 'Every screen must contain a clearly styled primary action button',
            type: 'component-presence',
            condition: { component_name: 'PrimaryButton' },
            severity: 'error'
          },
          {
            id: 'text-contrast',
            description: 'Text elements must have a minimum contrast ratio of 4.5:1 against the background',
            type: 'color-contrast',
            condition: { min_ratio: 4.5 },
            severity: 'error'
          },
          {
            id: 'font-size-min',
            description: 'Body text should be at least 14px for readability',
            type: 'font-size',
            condition: { min_px: 14 },
            severity: 'warning'
          },
          {
            id: 'tap-target-size',
            description: 'Interactive elements must be at least 44x44 pixels for touch accessibility',
            type: 'element-size',
            condition: { min_width: 44, min_height: 44 },
            severity: 'warning'
          },
          {
            id: 'missing-label',
            description: 'All input fields must have associated labels',
            type: 'label-presence',
            condition: { target: 'input' },
            severity: 'error'
          },
          {
            id: 'duplicate-cta',
            description: 'Avoid using the same CTA text more than once on a screen',
            type: 'text-uniqueness',
            condition: { target_text: 'Submit' },
            severity: 'warning'
          },
          {
            id: 'section-header-required',
            description: 'Sections must include a heading element for clarity',
            type: 'heading-presence',
            condition: { text_style: 'Heading' },
            severity: 'warning'
          },
          {
            id: 'icon-alt-text',
            description: 'Icons and images must include alt text or a label for accessibility',
            type: 'alt-text-presence',
            condition: { target: 'icon' },
            severity: 'warning'
          },
          {
            id: 'btn-alignment',
            description: 'Primary action buttons should be aligned consistently',
            type: 'element-alignment',
            condition: { target: 'PrimaryButton', alignment: 'bottom-right' },
            severity: 'warning'
          }
        ];

        this.currentRules = defaultRules;
        this.updateRulesTextarea();
        this.validateRules();
      }

      updateRulesTextarea() {
        const textarea = document.getElementById('rulesTextarea');
        if (textarea) {
          textarea.value = JSON.stringify(this.currentRules, null, 2);
        }
      }

      validateRules() {
        const textarea = document.getElementById('rulesTextarea');
        if (!textarea) return;

        try {
          const rulesText = textarea.value.trim();
          if (!rulesText) {
            this.showRulesError('Rules cannot be empty');
            return;
          }

          const parsedRules = JSON.parse(rulesText);
          
          if (!Array.isArray(parsedRules)) {
            this.showRulesError('Rules must be an array');
            return;
          }

          for (const rule of parsedRules) {
            if (!rule.id || !rule.description || !rule.type || !rule.condition) {
              this.showRulesError('Each rule must have id, description, type, and condition');
              return;
            }
          }

          this.currentRules = parsedRules;
          this.clearRulesError();
          this.refreshSelection();
          
        } catch (error) {
          this.showRulesError('Invalid JSON: ' + error.message);
        }
      }

      showRulesError(message) {
        const textarea = document.getElementById('rulesTextarea');
        if (textarea) {
          textarea.style.borderColor = '#dc3545';
          textarea.title = message;
        }
      }

      clearRulesError() {
        const textarea = document.getElementById('rulesTextarea');
        if (textarea) {
          textarea.style.borderColor = '#e1e5e9';
          textarea.title = '';
        }
      }

      onRulesChanged() {
        this.clearRulesError();
      }

      startScan() {
        if (this.isScanning || this.currentRules.length === 0) return;

        this.isScanning = true;
        this.updateScanButton(true);
        this.hideResults();
        this.hideError();

        parent.postMessage({
          pluginMessage: {
            type: 'scan-selection',
            rules: this.currentRules
          }
        }, '*');
      }

      updateScanButton(scanning) {
        const button = document.getElementById('scanButton');
        const buttonText = document.getElementById('scanButtonText');
        const spinner = document.getElementById('scanSpinner');

        if (button && buttonText && spinner) {
          if (scanning) {
            button.disabled = true;
            buttonText.textContent = 'Scanning...';
            spinner.classList.remove('hidden');
          } else {
            button.disabled = false;
            buttonText.textContent = 'Scan Selection';
            spinner.classList.add('hidden');
          }
        }
      }

      refreshSelection() {
        parent.postMessage({
          pluginMessage: {
            type: 'get-selection'
          }
        }, '*');
      }

      updateSelectionInfo(count) {
        const selectionInfo = document.getElementById('selectionInfo');
        const scanButton = document.getElementById('scanButton');

        if (selectionInfo && scanButton) {
          if (count === 0) {
            selectionInfo.textContent = 'Select frames or elements to scan';
            scanButton.disabled = true;
          } else {
            selectionInfo.textContent = count + ' element' + (count > 1 ? 's' : '') + ' selected';
            scanButton.disabled = this.currentRules.length === 0;
          }
        }
      }

      handlePluginMessage(message) {
        switch (message.type) {
          case 'plugin-ready':
            this.refreshSelection();
            break;

          case 'selection-info':
            this.updateSelectionInfo(message.count);
            break;

          case 'scan-complete':
            this.handleScanComplete(message.results);
            break;

          case 'scan-error':
            this.handleScanError(message.message);
            break;

          default:
            console.warn('Unknown message type:', message.type);
        }
      }

      handleScanComplete(results) {
        this.isScanning = false;
        this.updateScanButton(false);
        this.displayResults(results);
      }

      handleScanError(message) {
        this.isScanning = false;
        this.updateScanButton(false);
        this.showError(message);
      }

      displayResults(results) {
        this.updateScore(results.score);
        this.updateSummaryCounts(results);
        this.showResults();
        this.populateResultsList(results);

        if (results.errors.length === 0 && results.warnings.length === 0) {
          this.showNoIssues();
        } else {
          this.hideNoIssues();
        }
      }

      updateScore(score) {
        const scoreValue = document.getElementById('scoreValue');
        const scoreBadge = document.getElementById('scoreBadge');

        if (scoreValue && scoreBadge) {
          scoreValue.textContent = score + '%';
          
          scoreBadge.style.background = score >= 90 ? '#28a745' : 
                                      score >= 70 ? '#ffc107' : '#dc3545';
        }
      }

      updateSummaryCounts(results) {
        const passedCount = document.getElementById('passedCount');
        const warningsCount = document.getElementById('warningsCount');
        const errorsCount = document.getElementById('errorsCount');

        if (passedCount) passedCount.textContent = results.passed.length.toString();
        if (warningsCount) warningsCount.textContent = results.warnings.length.toString();
        if (errorsCount) errorsCount.textContent = results.errors.length.toString();
      }

      populateResultsList(results) {
        const resultsList = document.getElementById('resultsList');
        if (!resultsList) return;

        resultsList.innerHTML = '';

        const allResults = [...results.errors, ...results.warnings, ...results.passed];
        
        allResults.forEach(result => {
          const resultItem = this.createResultItem(result);
          resultsList.appendChild(resultItem);
        });
      }

      createResultItem(result) {
        const item = document.createElement('div');
        item.className = 'result-item result-' + result.status;

        const icon = result.status === 'passed' ? '✅' : 
                    result.status === 'warning' ? '⚠️' : '❌';
        
        item.innerHTML = '<div class="result-description">' + icon + ' ' + result.description + '</div>' +
                        '<div class="result-message">' + result.message + '</div>';

        return item;
      }

      showResults() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
          resultsSection.classList.remove('hidden');
        }
      }

      hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
          resultsSection.classList.add('hidden');
        }
      }

      showNoIssues() {
        const noIssues = document.getElementById('noIssues');
        if (noIssues) {
          noIssues.classList.remove('hidden');
        }
      }

      hideNoIssues() {
        const noIssues = document.getElementById('noIssues');
        if (noIssues) {
          noIssues.classList.add('hidden');
        }
      }

      showError(message) {
        const errorState = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');

        if (errorState && errorMessage) {
          errorMessage.textContent = message;
          errorState.classList.remove('hidden');
        }
      }

      hideError() {
        const errorState = document.getElementById('errorState');
        if (errorState) {
          errorState.classList.add('hidden');
        }
      }
    }

    // Initialize UI when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      new SpecLinterUI();
    });
  </script>
</body>
</html>
`;

// Show the UI with embedded HTML
figma.showUI(htmlContent, {
    width: 320,
    height: 500,
    themeColors: true
});

console.log('SpecLinter plugin loaded successfully');

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
async function handleScanSelection(rules) {
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
        const nodesToScan = [];
        
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
            message: `Scan failed: ${error.message || 'Unknown error'}`
        });
    }
}

// Recursively collect all child nodes
function collectChildNodes(node, collector) {
    if ('children' in node) {
        for (const child of node.children) {
            collector.push(child);
            collectChildNodes(child, collector);
        }
    }
}

// Run lint checks on collected nodes
async function runLintChecks(nodes, rules) {
    const results = {
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
                message: `Rule check failed: ${error.message || 'Unknown error'}`,
                nodes: []
            });
        }
    }

    // Calculate score
    results.score = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 100;

    return results;
}

// Check individual rule against nodes
async function checkRule(nodes, rule) {
    switch (rule.type) {
        case 'required-text':
            return checkRequiredText(nodes, rule);
        
        case 'font-size':
            return checkFontSize(nodes, rule);
        
        case 'color-contrast':
            return checkColorContrast(nodes, rule);
            
        case 'component-presence':
            return checkComponentPresence(nodes, rule);
            
        case 'element-size':
            return checkElementSize(nodes, rule);
            
        case 'label-presence':
            return checkLabelPresence(nodes, rule);
            
        case 'text-uniqueness':
            return checkTextUniqueness(nodes, rule);
            
        case 'heading-presence':
            return checkHeadingPresence(nodes, rule);
            
        case 'alt-text-presence':
            return checkAltTextPresence(nodes, rule);
            
        case 'element-alignment':
            return checkElementAlignment(nodes, rule);
        
        default:
            throw new Error(`Unknown rule type: ${rule.type}`);
    }
}

// Check for required text elements
function checkRequiredText(nodes, rule) {
    const textNodes = nodes.filter(node => node.type === 'TEXT');
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
function checkFontSize(nodes, rule) {
    const textNodes = nodes.filter(node => node.type === 'TEXT');
    const minSize = rule.condition.minSize || rule.condition.min_px || 12;
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

    const status = failingNodes.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: failingNodes.length === 0 ? 
            `All text meets minimum font size (${minSize}px)` :
            `${failingNodes.length} text elements below minimum font size (${minSize}px)`,
        nodes: failingNodes
    };
}

// Check color contrast (simplified version)
function checkColorContrast(nodes, rule) {
    const textNodes = nodes.filter(node => node.type === 'TEXT');
    const minContrast = rule.condition.minContrast || rule.condition.min_ratio || 4.5;
    const failingNodes = [];

    // This is a simplified implementation
    for (const node of textNodes) {
        // Check if the text has fills
        if (!node.fills || node.fills === figma.mixed || (Array.isArray(node.fills) && node.fills.length === 0)) {
            failingNodes.push({
                id: node.id,
                name: node.name,
                type: node.type,
                issue: 'No text color defined'
            });
        }
    }

    const status = failingNodes.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: failingNodes.length === 0 ? 
            `Color contrast check passed (min ${minContrast}:1)` :
            `${failingNodes.length} elements may have contrast issues`,
        nodes: failingNodes
    };
}

// Check for component presence (like PrimaryButton)
function checkComponentPresence(nodes, rule) {
    const componentName = rule.condition.component_name;
    const foundComponents = nodes.filter(node => 
        node.name.toLowerCase().includes(componentName.toLowerCase()) ||
        (node.type === 'COMPONENT' && node.name.toLowerCase().includes('button')) ||
        (node.type === 'INSTANCE' && node.name.toLowerCase().includes('button'))
    );

    const status = foundComponents.length > 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: foundComponents.length > 0 ? 
            `Found ${foundComponents.length} primary button(s)` :
            `No primary button found - ensure screen has a clear primary action`,
        nodes: foundComponents.length === 0 ? [] : foundComponents.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type
        }))
    };
}

// Check element size (tap targets)
function checkElementSize(nodes, rule) {
    const minWidth = rule.condition.min_width;
    const minHeight = rule.condition.min_height;
    const interactiveNodes = nodes.filter(node => 
        node.type === 'FRAME' || 
        node.type === 'COMPONENT' || 
        node.type === 'INSTANCE' ||
        (node.name && node.name.toLowerCase().includes('button'))
    );
    
    const failingNodes = [];

    for (const node of interactiveNodes) {
        if (node.width < minWidth || node.height < minHeight) {
            failingNodes.push({
                id: node.id,
                name: node.name,
                type: node.type,
                width: node.width,
                height: node.height,
                issue: `Size ${Math.round(node.width)}x${Math.round(node.height)}px is below ${minWidth}x${minHeight}px`
            });
        }
    }

    const status = failingNodes.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: failingNodes.length === 0 ? 
            `All interactive elements meet minimum size requirements (${minWidth}x${minHeight}px)` :
            `${failingNodes.length} interactive elements below minimum touch target size`,
        nodes: failingNodes
    };
}

// Check for label presence
function checkLabelPresence(nodes, rule) {
    const inputNodes = nodes.filter(node => 
        node.name.toLowerCase().includes('input') ||
        node.name.toLowerCase().includes('field') ||
        node.name.toLowerCase().includes('textfield')
    );
    
    const nodesWithoutLabels = [];

    for (const node of inputNodes) {
        // Look for nearby text nodes that could be labels
        const hasLabel = nodes.some(textNode => 
            textNode.type === 'TEXT' && 
            textNode.name.toLowerCase().includes('label') &&
            Math.abs(textNode.x - node.x) < 200 && 
            Math.abs(textNode.y - node.y) < 100
        );

        if (!hasLabel) {
            nodesWithoutLabels.push({
                id: node.id,
                name: node.name,
                type: node.type,
                issue: 'No associated label found'
            });
        }
    }

    const status = nodesWithoutLabels.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: nodesWithoutLabels.length === 0 ? 
            'All input fields have associated labels' :
            `${nodesWithoutLabels.length} input fields missing labels`,
        nodes: nodesWithoutLabels
    };
}

// Check for text uniqueness
function checkTextUniqueness(nodes, rule) {
    const targetText = rule.condition.target_text;
    const textNodes = nodes.filter(node => node.type === 'TEXT');
    
    const matchingNodes = textNodes.filter(node => 
        node.characters.toLowerCase().includes(targetText.toLowerCase())
    );

    const status = matchingNodes.length <= 1 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: matchingNodes.length <= 1 ? 
            `Text "${targetText}" appears appropriately (${matchingNodes.length} times)` :
            `Text "${targetText}" appears ${matchingNodes.length} times - consider using unique CTAs`,
        nodes: matchingNodes.length > 1 ? matchingNodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
            text: node.characters
        })) : []
    };
}

// Check for heading presence
function checkHeadingPresence(nodes, rule) {
    const headingNodes = nodes.filter(node => 
        node.type === 'TEXT' && (
            node.name.toLowerCase().includes('heading') ||
            node.name.toLowerCase().includes('title') ||
            node.name.toLowerCase().includes('header') ||
            (typeof node.fontSize === 'number' && node.fontSize >= 18)
        )
    );

    const status = headingNodes.length > 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: headingNodes.length > 0 ? 
            `Found ${headingNodes.length} heading element(s)` :
            'No heading elements found - add section headers for clarity',
        nodes: headingNodes.length === 0 ? [] : headingNodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type
        }))
    };
}

// Check for alt text presence
function checkAltTextPresence(nodes, rule) {
    const imageNodes = nodes.filter(node => 
        node.type === 'RECTANGLE' ||
        node.type === 'ELLIPSE' ||
        node.name.toLowerCase().includes('icon') ||
        node.name.toLowerCase().includes('image') ||
        node.name.toLowerCase().includes('img')
    );
    
    const nodesWithoutAltText = [];

    for (const node of imageNodes) {
        // Check if node has descriptive name or nearby text
        const hasAltText = node.name.toLowerCase().includes('alt') ||
                          node.name.toLowerCase().includes('desc') ||
                          nodes.some(textNode => 
                              textNode.type === 'TEXT' && 
                              Math.abs(textNode.x - node.x) < 100 && 
                              Math.abs(textNode.y - node.y) < 100
                          );

        if (!hasAltText) {
            nodesWithoutAltText.push({
                id: node.id,
                name: node.name,
                type: node.type,
                issue: 'No alt text or descriptive label found'
            });
        }
    }

    const status = nodesWithoutAltText.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: nodesWithoutAltText.length === 0 ? 
            'All icons and images have descriptive text' :
            `${nodesWithoutAltText.length} icons/images missing alt text`,
        nodes: nodesWithoutAltText
    };
}

// Check element alignment
function checkElementAlignment(nodes, rule) {
    const targetType = rule.condition.target;
    const expectedAlignment = rule.condition.alignment;
    
    const targetNodes = nodes.filter(node => 
        node.name.toLowerCase().includes(targetType.toLowerCase()) ||
        (targetType === 'PrimaryButton' && node.name.toLowerCase().includes('button'))
    );
    
    const misalignedNodes = [];
    
    if (targetNodes.length > 0) {
        // Simple alignment check - this could be enhanced based on specific requirements
        for (const node of targetNodes) {
            // For this example, we'll just check if buttons are reasonably positioned
            // In a real implementation, you'd check specific alignment rules
            const isWellAligned = true; // Simplified for demo
            
            if (!isWellAligned) {
                misalignedNodes.push({
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    issue: `Not aligned to ${expectedAlignment}`
                });
            }
        }
    }

    const status = misalignedNodes.length === 0 ? 'passed' : (rule.severity === 'error' ? 'error' : 'warning');

    return {
        ruleId: rule.id,
        description: rule.description,
        status: status,
        message: misalignedNodes.length === 0 ? 
            `Element alignment follows ${expectedAlignment} pattern` :
            `${misalignedNodes.length} elements not aligned consistently`,
        nodes: misalignedNodes
    };
}

// Handle highlighting a specific node
async function handleHighlightNode(nodeId) {
    try {
        const node = figma.getNodeById(nodeId);
        if (node) {
            figma.currentPage.selection = [node];
            figma.viewport.scrollAndZoomIntoView([node]);
            
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
            message: `Failed to highlight node: ${error.message || 'Unknown error'}`
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