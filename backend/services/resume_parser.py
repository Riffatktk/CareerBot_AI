"""Plain-text extraction from uploaded PDF/DOCX resume files."""

import io
from typing import Optional


async def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract plain text from a PDF or DOCX file.
    Returns extracted text string.
    """
    ext = filename.lower().split(".")[-1]

    if ext == "pdf":
        return await _extract_from_pdf(file_content)
    elif ext in ("docx", "doc"):
        return await _extract_from_docx(file_content)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


async def _extract_from_pdf(content: bytes) -> str:
    try:
        import fitz  # PyMuPDF
        import asyncio
        def _extract():
            doc = fitz.open(stream=content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text.strip()
        return await asyncio.to_thread(_extract)
    except ImportError:
        raise RuntimeError(
            "PyMuPDF not installed. Add PyMuPDF to requirements.txt"
        )


async def _extract_from_docx(content: bytes) -> str:
    try:
        import docx
        import asyncio
        def _extract():
            doc = docx.Document(io.BytesIO(content))
            return "\n".join([para.text for para in doc.paragraphs]).strip()
        return await asyncio.to_thread(_extract)
    except ImportError:
        raise RuntimeError(
            "python-docx not installed. Add python-docx to requirements.txt"
        )
