import requests
import PyPDF2
import io
from win32 import win32print

def print_pdf_from_url(url):
    # Fetch PDF from URL
    response = requests.get(url)
    if response.status_code == 200:
        pdf_bytes = response.content
        pdf_file = io.BytesIO(pdf_bytes)

        # Create a PDF reader
        pdf_reader = PyPDF2.PdfFileReader(pdf_file)

        # Print the PDF
        printer_name = win32print.GetDefaultPrinter()
        hprinter = win32print.OpenPrinter(printer_name)
        try:
            win32print.StartDocPrinter(hprinter, 1, ('Printing PDF', None, "RAW"))
            win32print.StartPagePrinter(hprinter)
            win32print.WritePrinter(hprinter, pdf_bytes)
            win32print.EndPagePrinter(hprinter)
            win32print.EndDocPrinter(hprinter)
        finally:
            win32print.ClosePrinter(hprinter)

    else:
        print(f"Failed to retrieve PDF from URL. Status code: {response.status_code}")

if __name__ == "__main__":
    pdf_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"  # Replace with your PDF URL
    print_pdf_from_url(pdf_url)
