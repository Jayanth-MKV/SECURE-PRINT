const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const PDF = require('../models/Pdf');

const storageRoot = path.resolve(__dirname, '..', 'storage');

function safeName(name) {
  return path.basename(name).replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 255) || 'document.pdf';
}

function isPdf(buffer) {
  return buffer?.subarray(0, 5).toString('ascii') === '%PDF-';
}

async function uploadPDF(request, response) {
  const files = request.files || [];
  if (!files.length || files.some((file) => !isPdf(file.buffer))) {
    return response.status(400).json({ message: 'Only valid PDF files are accepted' });
  }

  const userDirectory = path.join(storageRoot, request.user.sub);
  await fs.mkdir(userDirectory, { recursive: true });
  const created = [];
  const writtenFiles = [];

  try {
    for (const file of files) {
      const storageName = `${crypto.randomUUID()}.pdf`;
      await fs.writeFile(path.join(userDirectory, storageName), file.buffer, { flag: 'wx', mode: 0o600 });
      writtenFiles.push(storageName);
      const document = await PDF.create({
        owner: request.user.sub,
        originalName: safeName(file.originalname),
        storageName,
        size: file.size,
      });
      created.push({ id: document.id, originalName: document.originalName, size: document.size });
    }
    return response.status(201).json({ documents: created });
  } catch (error) {
    await Promise.all(writtenFiles.map((storageName) =>
      fs.rm(path.join(userDirectory, storageName), { force: true })));
    await Promise.all(created.map(async (document) => {
      await PDF.deleteOne({ _id: document.id, owner: request.user.sub });
    }));
    throw error;
  }
}

async function listPDFs(request, response) {
  const documents = await PDF.find({ owner: request.user.sub })
    .select('originalName size status createdAt')
    .sort({ createdAt: 1 })
    .lean();
  return response.json({ documents });
}

async function ownedDocument(request) {
  if (!mongoose.isValidObjectId(request.params.documentId)) return null;
  return PDF.findOne({ _id: request.params.documentId, owner: request.user.sub }).select('+storageName');
}

async function downloadPDF(request, response) {
  const document = await ownedDocument(request);
  if (!document) return response.status(404).json({ message: 'Document not found' });
  const filePath = path.join(storageRoot, request.user.sub, document.storageName);
  response.set({ 'Content-Type': 'application/pdf', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  return response.sendFile(filePath);
}

async function deletePDF(request, response) {
  const document = await ownedDocument(request);
  if (!document) return response.status(404).json({ message: 'Document not found' });
  await fs.rm(path.join(storageRoot, request.user.sub, document.storageName), { force: true });
  await document.deleteOne();
  return response.status(204).end();
}

module.exports = { uploadPDF, listPDFs, downloadPDF, deletePDF };
