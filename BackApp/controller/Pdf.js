const fs = require("fs-extra");
const path = require("path");
const PDF = require("../models/Pdf");

async function uploadPDF(req, res) {
  const { phoneNumber } = req.body;
  const files = req.files;

  console.log("inside upload");
  console.log(phoneNumber);
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadPath = path.join(__dirname, `../${phoneNumber}`);
  // console.log(uploadPath);

  try {
    // Create the directory if it doesn't exist
    await fs.ensureDir(`./${phoneNumber}`, (err) => {
      if (err) return console.log(err);
      console.log("Directory exists");
    });

    const pdfPromises = files.map((file) => {
      const { originalname } = file;
      const pdf = new PDF({ phoneNumber, filename: originalname });

      return new Promise((resolve, reject) => {
        pdf.save().then(() => {
            resolve();
        })
          .catch((err) => {
            reject(err);
          });
      });
    });

    await Promise.all(pdfPromises);

    res.json({ message: "PDFs uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading PDFs" });
  }
}

function listPDFs(req, res) {
  const phoneNumber = req.params.phoneNumber;
  const uploadPath = path.join(__dirname, `../${phoneNumber}/`);

  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading files" });
    }

    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
    res.json({ pdfFiles });
  });
}

function deletePDF(req, res) {
  const phoneNumber = req.params.phoneNumber;
  const filename = req.params.filename;
  const filePath = path.join(
    __dirname,
    `../${phoneNumber}/${filename}`
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting file" });
    }

    PDF.deleteOne({ phoneNumber, filename })
      .then(() => {
      res.json({ message: "PDF file deleted successfully" });
      })
      .catch(
        (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting PDF record" });
      }

    });
      });
}

module.exports = { uploadPDF, listPDFs, deletePDF };
