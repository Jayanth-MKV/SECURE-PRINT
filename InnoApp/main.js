const { app, BrowserWindow,ipcMain,dialog } = require("electron");

let win;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile("login.html");

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(createWindow);


// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

let selection;

app.on("ready", () => {
  const { dialog } = require("electron");
  // dialog.showMessageBox(null);
  const printerSelection = dialog.showMessageBox({
      type: "info",
      buttons: ['OneNote for Windows 10', 'OneNote (Desktop)', 'My-Printer-1', 'Microsoft XPS Document Writer', 'Microsoft Print to PDF'],
      title: "Select Printer",
      message: "Choose a printer for the PDF:",
  });
  selection=printerSelection.response
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the
  // app when the dock icon is clicked and there are no
  // other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to get a list of available printers
ipcMain.on("getPrinters", (event) => {
  const printers = win.webContents.getPrinters();
  console.log(printers)
  event.returnValue = printers.map((printer) => printer.name);
});

ipcMain.on("getSelection", (e) => {
    const { dialog } = require("electron");
const printers = win.webContents.getPrinters();
    const printerSelection = dialog.showMessageBox({
      type: "info",
      buttons: printers,
      title: "Select Printer",
      message: "Choose a printer for the PDF:",
    });

    if (printerSelection.response !== 0) {
      // User canceled the printer selection
      return;
  }
  e.returnValue = printerSelection.response || selection;
})



ipcMain.on("sendprintjob", (event) => {
  console.log("In sendprint")
  win.webContents.print({silent:true}, (success, errorType) => {
    if (!success) {
      console.error(`Error printing PDF: `);
    }
  })


  

});
// ipcMain.on("printPDF", (event, pdfUrl, printerName) => {
//   try {
//     const options = {
//       silent: true,
//       printBackground: true,
//       deviceName: printerName,
//     };

//     mainWindow.webContents.print(options, (success, errorType) => {
//       if (!success) {
//         console.error(`Error printing PDF: ${errorType}`);
//       }
//     });
//   } catch (error) {
//     console.error("Error printing PDF:", error);
//   }
// });

// const electron = require("electron");

// const { app, BrowserWindow, ipcMain } = electron;

// let mainWindow;

// function createWindow() {
//     mainWindow = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false,
//         enableRemoteModule: true,
//       },
//     });
//   mainWindow.loadFile("index.html");
// }

// app.whenReady().then(createWindow);

// ipcMain.on("print-pdf", (event) => {
//     if (mainWindow) {

//         printWindow = new BrowserWindow({ show: false });

//         printWindow.loadURL(
//           "https://jntugvcev.edu.in/wp-content/uploads/2021/10/R20-CSE-with-HONORS-AND-MINORS-FINAL-22-10-2021-converted.pdf"
//         );
//          printWindow.webContents.on("did-finish-load", () => {
//            printWindow.webContents.print({}, (success, errorType) => {
//              if (!success) {
//                console.error(`Error printing PDF: ${errorType}`);
//              }

//              // Delete the temporary PDF file
//             //  fs.removeSync(tempFilePath);
//            });
//          });
//     // mainWindow.webContents.print({}, (success, errorType) => {
//     //   if (!success) {
//     //     console.error(`Error printing PDF: ${errorType}`);
//     //   } else {
//     //     // Send a message to delete the temporary PDF after printing
//     //     mainWindow.webContents.send("delete-temp-pdf");
//     //   }
//     // });
//   }
// });
