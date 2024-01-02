from pydantic import BaseModel


class FileEncodingRequest(BaseModel):
    file: bytes


class FileEncodingResponse(BaseModel):
    file_name: str
    encoding: str
    confidence: float
