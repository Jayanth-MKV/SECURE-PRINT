import PyPDF2
import tkinter as tk
import sys

class PDFViewer(tk.Frame):
    def __init__(self, master):
        super().__init__(master)
        self.pdf_file = None
        self.page_number = 0

    def open_file(self):
        filename = tk.filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
        if filename:
            self.pdf_file = open(filename, "rb")
            self.page_number = 0
            self.update_page()

    def view_page(self):
        if self.pdf_file is None:
            tk.messagebox.showerror("Error", "No PDF file is open.")
            return

        self.canvas.delete("all")
        page = PyPDF2.PdfFileReader(self.pdf_file).getPage(self.page_number)
        image = page.getImage()
        self.canvas.create_image(0, 0, image=image)

    def next_page(self):
        if self.pdf_file is None:
            tk.messagebox.showerror("Error", "No PDF file is open.")
            return

        self.page_number += 1
        self.update_page()

    def previous_page(self):
        if self.pdf_file is None:
            tk.messagebox.showerror("Error", "No PDF file is open.")
            return

        self.page_number -= 1
        self.update_page()

    def update_page(self):
        self.canvas.configure(width=self.pdf_file.getPage(self.page_number).getImage().width(),
                             height=self.pdf_file.getPage(self.page_number).getImage().height())

    def print_page(self):
        if self.pdf_file is None:
            tk.messagebox.showerror("Error", "No PDF file is open.")
            return

        self.pdf_file.getPage(self.page_number).write(sys.stdout)

def main():
    root = tk.Tk()
    pdf_viewer = PDFViewer(root)
    pdf_viewer.pack(side="top", fill="both", expand=True)

    menubar = tk.Menu(root)
    file_menu = tk.Menu(menubar, tearoff=False)
    file_menu.add_command(label="Open", command=pdf_viewer.open_file)
    file_menu.add_command(label="Print", command=pdf_viewer.print_page)
    file_menu.add_separator()
    file_menu.add_command(label="Quit", command=root.quit)
    menubar.add_cascade(label="File", menu=file_menu)

    root.config(menu=menubar)
    root.mainloop()

if __name__ == "__main__":
    main()