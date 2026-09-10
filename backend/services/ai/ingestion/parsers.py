import os

def parse_pdf(file_path: str) -> str:
    text = ""
    try:
        import PyPDF2
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for idx, page in enumerate(reader.pages):
                text += f"\n--- Page {idx+1} ---\n" + (page.extract_text() or "")
    except Exception as e:
        text = f"Error reading PDF: {e}"
    return text
