from typing import Any, Tuple

import chardet
from fastapi import APIRouter, File, HTTPException, UploadFile

from pydantic import BaseModel


class FileEncodingRequest(BaseModel):
    file: bytes


class FileEncodingResponse(BaseModel):
    file_name: str
    encoding: str
    confidence: float



router = APIRouter()


def detect_encoding(file: bytes) -> FileEncodingResponse:
    result = chardet.detect(file)
    encoding = result["encoding"] or "NOT_FOUND"
    confidence = result["confidence"]
    print(f"encoding = {encoding} confidence={confidence}")
    return FileEncodingResponse(file_name="", encoding=encoding, confidence=confidence)


@router.post("/detect-encoding", response_model=FileEncodingResponse)
async def detect_file_encoding(file: UploadFile = File(...)) -> FileEncodingResponse:
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_contents = await file.read()
    result = detect_encoding(file_contents)
    result.file_name = file.filename
    return result
