// UI TypeScript code for handling user interactions and communication with plugin

interface Rule {
  id: string;
  description: string;
  type: string;
  condition: any;
}

interface ScanResult {
  ruleId: string;
  description: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
  nodes: any[];
}

interface ScanResults {
  passed: ScanResult[];
  warnings: ScanResult[];
  errors: ScanResult[];
  score: number;
}

class SpecLinterUI {
  private currentRules: Rule[] = [];
  private isScanning: boolean = false;

  constructor() {
    this.initializeUI();
    this.loadDefaultRules();
    this.setupEventListeners();
  }

  private initializeUI() {
    // Initialize UI state
    this.updateSelectionInfo(0);
    this.hideResults();
  }

  private setupEventListeners() {
    // Load default rules button
    document.getElementById('loadDefaultRules')?.addEventListener('click', () => {
      this.loadDefaultRules();
    });

    // Validate rules button
    document.getElementById('validateRules')?.addEventListener('click', () => {
      this.validateRules();
    });

    // Scan button
    document.getElementById('scanButton')?.addEventListener('click', () => {
      this.startScan();
    });

    // Retry button
    document.getElementById('retryButton')?.addEventListener('click', () => {
      this.hideError();
      this.refreshSelection();
    });

    // Rules textarea change
    document.getElementById('rulesTextarea')?.addEventListener('input', () => {
      this.onRulesChanged();
    });

    // Listen for plugin messages
    window.onmessage = (event) => {
      this.handlePluginMessage(event.data.pluginMessage);
    };
  }

  private loadDefaultRules() {
    const defaultRules: Rule[] = [
      {
        id: 'required-cta',
        description: 'Call-to-action button must be present',
        type: 'required-text',
        condition: { text: 'button' }
      },
      {
        id: 'min-font-size',
        description: 'Text must be at least 12px',
        type: 'font-size',
        condition: { minSize: 12 }
      },
      {
        id: 'color-contrast',
        description: 'Text must meet WCAG contrast requirements',
        type: 'color-contrast',
        condition: { minContrast: 4.5 }
      }
    ];

    this.currentRules = defaultRules;
    this.updateRulesTextarea();
    this.validateRules();
  }

  private updateRulesTextarea() {
    const textarea = document.getElementById('rulesTextarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = JSON.stringify(this.currentRules, null, 2);
    }
  }

  private validateRules() {
    const textarea = document.getElementById('rulesTextarea') as HTMLTextAreaElement;
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

      // Validate rule structure
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
      this.showRulesError(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private showRulesError(message: string) {
    // Add error styling to textarea
    const textarea = document.getElementById('rulesTextarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.classList.add('error');
      textarea.title = message;
    }
  }

  private clearRulesError() {
    const textarea = document.getElementById('rulesTextarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.classList.remove('error');
      textarea.title = '';
    }
  }

  private onRulesChanged() {
    // Clear validation errors when user types
    this.clearRulesError();
  }

  private startScan() {
    if (this.isScanning || this.currentRules.length === 0) return;

    this.isScanning = true;
    this.updateScanButton(true);
    this.hideResults();
    this.hideError();

    // Send scan message to plugin
    parent.postMessage({
      pluginMessage: {
        type: 'scan-selection',
        rules: this.currentRules
      }
    }, '*');
  }

  private updateScanButton(scanning: boolean) {
    const button = document.getElementById('scanButton') as HTMLButtonElement;
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

  private refreshSelection() {
    // Request current selection info from plugin
    parent.postMessage({
      pluginMessage: {
        type: 'get-selection'
      }
    }, '*');
  }

  private updateSelectionInfo(count: number) {
    const selectionInfo = document.getElementById('selectionInfo');
    const scanButton = document.getElementById('scanButton') as HTMLButtonElement;

    if (selectionInfo && scanButton) {
      if (count === 0) {
        selectionInfo.textContent = 'Select frames or elements to scan';
        scanButton.disabled = true;
      } else {
        selectionInfo.textContent = `${count} element${count > 1 ? 's' : ''} selected`;
        scanButton.disabled = this.currentRules.length === 0;
      }
    }
  }

  private handlePluginMessage(message: any) {
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

      case 'node-highlighted':
        console.log(`Node ${message.nodeId} highlighted`);
        break;

      case 'highlight-error':
        console.error('Highlight error:', message.message);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleScanComplete(results: ScanResults) {
    this.isScanning = false;
    this.updateScanButton(false);
    this.displayResults(results);
  }

  private handleScanError(message: string) {
    this.isScanning = false;
    this.updateScanButton(false);
    this.showError(message);
  }

  private displayResults(results: ScanResults) {
    // Update score
    this.updateScore(results.score);

    // Update summary counts
    this.updateSummaryCounts(results);

    // Show results section
    this.showResults();

    // Populate results list
    this.populateResultsList(results);

    // Show no issues state if everything passed
    if (results.errors.length === 0 && results.warnings.length === 0) {
      this.showNoIssues();
    } else {
      this.hideNoIssues();
    }
  }

  private updateScore(score: number) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreBadge = document.getElementById('scoreBadge');

    if (scoreValue && scoreBadge) {
      scoreValue.textContent = `${score}%`;
      
      // Update badge color based on score
      scoreBadge.className = 'score-badge';
      if (score >= 90) {
        scoreBadge.classList.add('score-excellent');
      } else if (score >= 70) {
        scoreBadge.classList.add('score-good');
      } else if (score >= 50) {
        scoreBadge.classList.add('score-fair');
      } else {
        scoreBadge.classList.add('score-poor');
      }
    }
  }

  private updateSummaryCounts(results: ScanResults) {
    const passedCount = document.getElementById('passedCount');
    const warningsCount = document.getElementById('warningsCount');
    const errorsCount = document.getElementById('errorsCount');

    if (passedCount) passedCount.textContent = results.passed.length.toString();
    if (warningsCount) warningsCount.textContent = results.warnings.length.toString();
    if (errorsCount) errorsCount.textContent = results.errors.length.toString();
  }

  private populateResultsList(results: ScanResults) {
    const resultsList = document.getElementById('resultsList');
    if (!resultsList) return;

    resultsList.innerHTML = '';

    // Add all results (errors first, then warnings, then passed)
    const allResults = [...results.errors, ...results.warnings, ...results.passed];
    
    allResults.forEach(result => {
      const resultItem = this.createResultItem(result);
      resultsList.appendChild(resultItem);
    });
  }

  private createResultItem(result: ScanResult): HTMLElement {
    const item = document.createElement('div');
    item.className = `result-item result-${result.status}`;

    const icon = this.getStatusIcon(result.status);
    
    item.innerHTML = `
      <div class="result-header">
        <span class="result-icon">${icon}</span>
        <span class="result-description">${result.description}</span>
      </div>
      <div class="result-message">${result.message}</div>
      ${result.nodes.length > 0 ? this.createNodesList(result.nodes) : ''}
    `;

    return item;
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'passed': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  }

  private createNodesList(nodes: any[]): string {
    if (nodes.length === 0) return '';

    const nodeItems = nodes.map(node => `
      <div class="node-item" data-node-id="${node.id}">
        <span class="node-name">${node.name}</span>
        <span class="node-type">${node.type}</span>
      </div>
    `).join('');

    return `
      <div class="nodes-list">
        <div class="nodes-header">Affected Elements:</div>
        ${nodeItems}
      </div>
    `;
  }

  private showResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.classList.remove('hidden');
    }
  }

  private hideResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.classList.add('hidden');
    }
  }

  private showNoIssues() {
    const noIssues = document.getElementById('noIssues');
    if (noIssues) {
      noIssues.classList.remove('hidden');
    }
  }

  private hideNoIssues() {
    const noIssues = document.getElementById('noIssues');
    if (noIssues) {
      noIssues.classList.add('hidden');
    }
  }

  private showError(message: string) {
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');

    if (errorState && errorMessage) {
      errorMessage.textContent = message;
      errorState.classList.remove('hidden');
    }
  }

  private hideError() {
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

// Handle node clicks for highlighting
document.addEventListener('click', (event) => {
  const nodeItem = (event.target as Element).closest('.node-item');
  if (nodeItem) {
    const nodeId = nodeItem.getAttribute('data-node-id');
    if (nodeId) {
      parent.postMessage({
        pluginMessage: {
          type: 'highlight-node',
          nodeId: nodeId
        }
      }, '*');
    }
  }
});
