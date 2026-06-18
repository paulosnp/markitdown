"""
Servidor API para o MarkItDown.
Expõe endpoints REST para conversão de arquivos, URLs e texto.
Roda na porta 7860 por padrão.
"""

import os
import sys
import tempfile
import traceback
from pathlib import Path

try:
    from fastapi import FastAPI, UploadFile, File
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("Dependências faltando. Instale com:")
    print("  pip install fastapi uvicorn python-multipart")
    sys.exit(1)

from markitdown import MarkItDown

app = FastAPI(title="MarkItDown API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

md = MarkItDown()


class UrlRequest(BaseModel):
    url: str


class TextRequest(BaseModel):
    content: str
    format: str = "html"


@app.get("/")
def health():
    return {"status": "ok", "service": "markitdown-api"}


@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    """Converte um arquivo enviado via upload para Markdown."""
    suffix = Path(file.filename).suffix if file.filename else ".tmp"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = md.convert(tmp_path)
        return {
            "markdown": result.text_content,
            "metadata": {
                "filename": file.filename,
                "size": len(content),
                "type": file.content_type,
            },
        }
    except Exception as e:
        return {
            "markdown": "",
            "metadata": {"error": str(e)},
        }
    finally:
        os.unlink(tmp_path)


@app.post("/convert/url")
async def convert_url(req: UrlRequest):
    """Converte conteúdo de uma URL para Markdown."""
    try:
        result = md.convert_url(req.url)
        return {
            "markdown": result.text_content,
            "metadata": {"url": req.url},
        }
    except Exception as e:
        return {
            "markdown": "",
            "metadata": {"error": str(e)},
        }


@app.post("/convert/text")
async def convert_text(req: TextRequest):
    """Converte texto bruto (HTML, etc.) para Markdown."""
    suffix_map = {
        "html": ".html",
        "rst": ".rst",
        "latex": ".tex",
        "csv": ".csv",
        "json": ".json",
        "xml": ".xml",
        "yaml": ".yaml",
        "plain": ".txt",
    }
    suffix = suffix_map.get(req.format, ".txt")

    with tempfile.NamedTemporaryFile(
        delete=False, suffix=suffix, mode="w", encoding="utf-8"
    ) as tmp:
        tmp.write(req.content)
        tmp_path = tmp.name

    try:
        result = md.convert(tmp_path)
        return {
            "markdown": result.text_content,
            "metadata": {"format": req.format, "length": len(req.content)},
        }
    except Exception as e:
        return {
            "markdown": "",
            "metadata": {"error": str(e)},
        }
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"MarkItDown API rodando em http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
