const { ipcRenderer} = require("electron");

// Replace this with your PDFs API endpoint
const pdfsApiEndpoint = `http://localhost:5000/pdfs/0987654321/`;

const pdfList = document.getElementById("pdfList");

async function fetchAndDisplayPDFs() {
  try {
    // Fetch the list of PDFs from your API
    const response = await fetch(pdfsApiEndpoint);
    const pdfs = await response.json();

    console.log(pdfs)

    // Create links for each PDF
    pdfs?.pdfFiles.forEach((pdf, index) => {
      console.log(pdf)
      const pdfLink = document.createElement("a");
      pdfLink.href = `../BackApp/0987654321/${pdf}`;
      pdfLink.textContent = `PDF ${index + 1}`;
      pdfLink.addEventListener("click", (event) => {
        event.preventDefault();
        printPDF(`../BackApp/0987654321/${pdf}`,pdf);
      });

      const listItem = document.createElement("li");
      listItem.appendChild(pdfLink);
      pdfList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching and displaying PDFs:", error);
  }
}

async function printPDF(pdfUrl,pdf) {
  try {
    // Fetch the selected PDF from the API
    const response = await fetch(pdfUrl);
    const pdfData = await response.blob();

    // Create a blob URL for the PDF
    const pdfBlobUrl = URL.createObjectURL(pdfData);

    // Get a list of available printers
    // const printers = ipcRenderer.sendSync("getPrinters");
    // console.log(printers)
    // if (printers.length === 0) {
    //   // No printers available, inform the user
    //   console.log("No printers are available.");
    //   return;
    // }

    // const selection = ipcRenderer.sendSync("getSelection");

    // ipcRenderer.send(
    //   "printPDF",
    //   pdfBlobUrl,
      // printers[selection]
    // );

      printPD(pdfBlobUrl, {
    name: 'My-Printer-1',
    displayName: 'My-Printer-1',
    description: '',
    status: 2,
    isDefault: true,
    options: {
      'printer-location': '',
      'printer-make-and-model': 'Generic / Text Only',
      system_driverinfo: 'Generic / Text Only;10.0.22621.1848 (WinBuild.160101.0800);Microsoft┬« Windows┬« Operating System;10.0.22621.1848'
    }
  },pdf);

    // Initiate silent printing
    // ipcRenderer.send("printPDF", pdfBlobUrl, printers[0]);
  } catch (error) {
    console.error("Error fetching or printing PDF:", error);
  }
}


async function printPD(pdfUrl, printer, filenameToDelete) {
  console.log(filenameToDelete)
  try {
    // Get a list of available printers
    // const printers = ipcRenderer.sendSync("getPrinters");

    // if (printers.length === 0) {
    //   // No printers available, inform the user
    //   console.log("No printers are available.");
    //   return;
    // }

    // Display a printer selection dialog
    // const printerSelection = await dialog.showMessageBox({
    //   type: "info",
    //   buttons: printers,
    //   title: "Select Printer",
    //   message: "Choose a printer for the PDF:",
    // });

    // if (printerSelection.response !== 0) {
    //   // User canceled the printer selection
    //   return;
    // }

    // Create a hidden iframe to load and print the PDF
    const iframe = document.createElement("iframe");
    // iframe.style.display = "none"; // Hide the iframe
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    // Wait for the PDF to load and then initiate printing with the selected printer
    iframe.onload = () => {
      setTimeout(() => {
        console.log("printing");
        iframe.contentWindow.print({
          silent: true,
          printBackground: true,
          deviceName: printer,
        });
        ipcRenderer.sendSync("sendprintjob");
      }, 2000);

      console.log("after print");

      const deleteUrl = `http://localhost:5000/pdfs/0987654321/${filenameToDelete}`;
      fetch(deleteUrl, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log(`File ${filenameToDelete} deleted successfully.`);
          } else {
            console.error(`Failed to delete file ${filenameToDelete}.`);
          }
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });

      // Clean up after printing
      iframe.onafterprint = () => {
        document.body.removeChild(iframe);
      };
    };
  } catch (error) {
    console.error("Error fetching or printing PDF:", error);
  }
}

// async function printPDF(pdfUrl) {
//   try {
//     // Fetch the selected PDF from the API
//     const response = await fetch(pdfUrl);
//     const pdfData = await response.blob();

//     // Create a blob URL for the PDF
//     const pdfBlobUrl = URL.createObjectURL(pdfData);

//     // Get a list of available printers
//     const printers = ipcRenderer.sendSync("getPrinters"); // You need to implement this in your main process

//     if (printers.length === 0) {
//       // No printers available, inform the user
//       console.log("No printers are available.");
//       return;
//     }

//     // Create a hidden iframe to load and print the PDF
//     const iframe = document.createElement("iframe");
//     iframe.src = pdfBlobUrl;
//     document.body.appendChild(iframe);

//     // Wait for the PDF to load and then initiate silent printing
//     iframe.onload = () => {
//       ipcRenderer.send("printPDF", pdfBlobUrl, printers[0]); // You need to implement this in your main process
//       // Clean up after printing
//       iframe.onafterprint = () => {
//         document.body.removeChild(iframe);
//         URL.revokeObjectURL(pdfBlobUrl);
//       };
//     };
//   } catch (error) {
//     console.error("Error fetching or printing PDF:", error);
//   }
// }

// Fetch and display PDFs when the app loads
fetchAndDisplayPDFs();

// const { ipcRenderer, remote } = require("electron");
// const fs = require("fs");
// const path = require("path");

// document
//   .getElementById("fetch-and-display-pdf")
//   .addEventListener("click", async () => {
//     const pdfURL =
//       "https://jntugvcev.edu.in/wp-content/uploads/2021/10/R20-CSE-with-HONORS-AND-MINORS-FINAL-22-10-2021-converted.pdf"; // Replace with the actual URL
//     const tempFileName = "temp.pdf"; // Temporary file name

//     // Download the PDF and save it to a temporary file
//       const response = await fetch(pdfURL);
//       console.log(response.body)
//       const buffer = response.body;
//       let text = await new Response(buffer).text();

//     const pdfViewer = document.getElementById("pdf-viewer");
//       pdfViewer.src = pdfURL;
//     pdfViewer.style.display = "block";
//   });

// document.getElementById("print-pdf").addEventListener("click", () => {
//   ipcRenderer.send("print-pdf");
// });

// // Function to delete the temporary PDF file
// ipcRenderer.on("delete-temp-pdf", () => {
//   const tempFileName = "temp.pdf"; // Temporary file name
//   const tempFilePath = path.join(__dirname, tempFileName);

//   // Check if the file exists before attempting to delete it
//   if (fs.existsSync(tempFilePath)) {
//     fs.unlinkSync(tempFilePath);
//   }
// });
