import os
import tempfile
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix if file.filename else ".tmp"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        try:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao ler arquivo enviado: {str(e)}")

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
        raise HTTPException(status_code=500, detail=f"Erro na conversão: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

@app.post("/convert/url")
def convert_url(req: UrlRequest):
    try:
        result = md.convert_url(req.url)
        return {
            "markdown": result.text_content,
            "metadata": {"url": req.url},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao converter URL: {str(e)}")

@app.post("/convert/text")
def convert_text(req: TextRequest):
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
    suffix = suffix_map.get(req.format.lower(), ".txt")

    with tempfile.NamedTemporaryFile(
        delete=False, suffix=suffix, mode="w", encoding="utf-8"
    ) as tmp:
        try:
            tmp.write(req.content)
            tmp_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao salvar texto temporário: {str(e)}")

    try:
        result = md.convert(tmp_path)
        return {
            "markdown": result.text_content,
            "metadata": {"format": req.format, "length": len(req.content)},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao converter texto: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass
