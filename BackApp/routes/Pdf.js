const express = require('express');
const multer = require('multer');
const requireAuth = require('../middleware/auth');
const { uploadPDF, listPDFs, downloadPDF, deletePDF } = require('../controller/Pdf');

const router = express.Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: Number(process.env.MAX_PDF_BYTES || 10 * 1024 * 1024),
  },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype === 'application/pdf');
  },
});

router.use(requireAuth);
router.post('/', upload.array('file', 5), asyncHandler(uploadPDF));
router.get('/', asyncHandler(listPDFs));
router.get('/:documentId/content', asyncHandler(downloadPDF));
router.delete('/:documentId', asyncHandler(deletePDF));

module.exports = router;
