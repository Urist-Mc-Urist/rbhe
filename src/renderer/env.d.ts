// Declare custom properties on the global Window object
declare global {
  interface Window {
    electronAPI: {
      getGreeting: (name: string) => Promise<string>;
    };
  }
}

export {}; // Mark as a module to avoid global scope pollution