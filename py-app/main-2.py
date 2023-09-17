import requests
from io import BytesIO
import subprocess
import platform

def fetch_pdf_from_url(url):
    response = requests.get(url)
    if response.status_code == 200:
        return BytesIO(response.content)
    else:
        print(f"Failed to retrieve PDF from URL. Status code: {response.status_code}")
        return None

def print_pdf(pdf_stream):
    if platform.system() == 'Windows':
        # Windows printing using the lpr command
        process = subprocess.Popen(['lpr'], stdin=subprocess.PIPE, shell=True)
        process.communicate(input=pdf_stream.read())
    else:
        # Add platform-specific code for printing on other OS
        print("Printing is currently only supported on Windows using the 'lpr' command.")

if __name__ == "__main__":
    pdf_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"  # Replace with your PDF URL
    pdf_stream = fetch_pdf_from_url(pdf_url)
    
    if pdf_stream:
        print_pdf(pdf_stream)
