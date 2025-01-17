const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/";

export const initPyodide = async () => {
  if (!window.loadPyodide) {
    const script = document.createElement("script");
    script.src = `${PYODIDE_CDN}pyodide.js`;
    document.head.appendChild(script);
  }

  return new Promise((resolve) => {
    const checkPyodide = async () => {
      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_CDN,
        });
        resolve(pyodide);
      } else {
        setTimeout(checkPyodide, 100);
      }
    };
    checkPyodide();
  });
};
