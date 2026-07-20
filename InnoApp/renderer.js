const statusElement = document.getElementById('status');
const loginForm = document.getElementById('loginForm');

function showStatus(message) {
  statusElement.textContent = message;
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showStatus('Signing in…');
    try {
      await window.securePrint.login(
        document.getElementById('phoneNumber').value,
        document.getElementById('password').value,
      );
    } catch {
      showStatus('Sign in failed.');
    }
  });
}

const listElement = document.getElementById('pdfList');
const printerElement = document.getElementById('printer');

async function loadQueue() {
  if (!listElement) return;
  showStatus('Loading…');
  listElement.replaceChildren();
  try {
    const [documents, printers] = await Promise.all([
      window.securePrint.listDocuments(),
      window.securePrint.listPrinters(),
    ]);
    printerElement.replaceChildren(...printers.map((printer) => {
      const option = document.createElement('option');
      option.value = printer.name;
      option.textContent = printer.displayName || printer.name;
      option.selected = printer.isDefault;
      return option;
    }));

    for (const item of documents) {
      const row = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `Print ${item.originalName}`;
      button.addEventListener('click', async () => {
        button.disabled = true;
        showStatus(`Printing ${item.originalName}…`);
        try {
          await window.securePrint.printDocument(item._id, printerElement.value);
          showStatus('Print callback succeeded; server and temporary copies were deleted.');
          await loadQueue();
        } catch {
          showStatus('Print failed. The server document was retained.');
          button.disabled = false;
        }
      });
      row.appendChild(button);
      listElement.appendChild(row);
    }
    showStatus(documents.length ? `${documents.length} document(s) pending.` : 'No documents pending.');
  } catch {
    showStatus('Unable to load the authenticated queue.');
  }
}

document.getElementById('refresh')?.addEventListener('click', loadQueue);
void loadQueue();
