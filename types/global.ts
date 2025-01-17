interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
  }