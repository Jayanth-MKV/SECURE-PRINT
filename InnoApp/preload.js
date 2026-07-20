const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('securePrint', {
  login: (phoneNumber, password) => ipcRenderer.invoke('auth:login', { phoneNumber, password }),
  listDocuments: () => ipcRenderer.invoke('documents:list'),
  listPrinters: () => ipcRenderer.invoke('printers:list'),
  printDocument: (documentId, printerName) =>
    ipcRenderer.invoke('documents:print', { documentId, printerName }),
});
