import tempfile
from typing import Any, Tuple

import chardet
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from .mimes import guess_mime_type_from_file


class FileEncodingRequest(BaseModel):
    file: bytes


class FileEncodingResponse(BaseModel):
    file_name: str
    encoding: str
    confidence: float


router = APIRouter()


def detect_encoding(file: bytes) -> FileEncodingResponse:
    result = chardet.detect(file)
    encoding = result["encoding"]
    confidence = result["confidence"]
    if not encoding:
        with tempfile.NamedTemporaryFile(delete=True) as temp_file:
            temp_file.write(file)  # Writing in binary mode
            temp_file_path = temp_file.name
            encoding = guess_mime_type_from_file(file_path=temp_file_path)
            confidence = 1

    if not encoding:
        encoding = "NOT_FOUND"
        confidence = 0

    print(f"encoding = {encoding} confidence={confidence}")
    return FileEncodingResponse(file_name="", encoding=encoding, confidence=confidence)


@router.post("/detect-encoding", response_model=FileEncodingResponse)
async def detect_file_encoding(file: UploadFile = File(...)) -> FileEncodingResponse:
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    print(f"file: {file.filename}")

    file_contents = await file.read()
    result = detect_encoding(file_contents)
    result.file_name = file.filename
    return result
