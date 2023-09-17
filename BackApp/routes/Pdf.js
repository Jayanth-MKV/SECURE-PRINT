const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs-extra');
const { uploadPDF, listPDFs, deletePDF } = require("../controller/Pdf.js");

const router = express.Router();
const storage = multer.diskStorage({
  destination: async(req, file, cb) => {
    const {phoneNumber} = req.query;
    console.log(req)
    console.log(file)
    await fs.ensureDir(`./${phoneNumber}`, (err) => {
      if (err) return console.log(err);
      console.log("Directory exists");
    });
    const uploadPath = path.join(__dirname, `../${phoneNumber}`);
    // fs.mkdir(uploadPath, (err) => {
      console.log(uploadPath)
      console.log(phoneNumber)
      cb(null, uploadPath);
  // }
    // )
  },
  filename: (req, file, cb) => {
const now = new Date().toISOString();
const date = now.replace(/:/g, "-");
cb(null, date + file.originalname);  },
});
const upload = multer({ storage });


router.post("/upload", upload.array("file", 5), uploadPDF);
router.get("/pdfs/:phoneNumber", listPDFs);
router.delete("/pdfs/:phoneNumber/:filename", deletePDF);

module.exports = router;
