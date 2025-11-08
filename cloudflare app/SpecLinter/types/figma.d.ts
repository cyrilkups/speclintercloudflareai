// Basic Figma plugin type definitions
declare const figma: {
  showUI(html: string, options?: { width?: number; height?: number; themeColors?: boolean }): void;
  closePlugin(): void;
  ui: {
    postMessage(message: any): void;
    onmessage: ((message: any) => void) | null;
  };
  currentPage: {
    selection: SceneNode[];
  };
  viewport: {
    scrollAndZoomIntoView(nodes: SceneNode[]): void;
  };
  getNodeById(id: string): BaseNode | null;
  mixed: symbol;
};

declare const __html__: string;

interface BaseNode {
  id: string;
  name: string;
  type: string;
}

interface SceneNode extends BaseNode {
  children?: ReadonlyArray<SceneNode>;
}

interface TextNode extends SceneNode {
  type: 'TEXT';
  characters: string;
  fontSize: number | symbol;
  fills: ReadonlyArray<Paint> | symbol;
}

interface Paint {
  type: string;
  color?: RGB;
  opacity?: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}