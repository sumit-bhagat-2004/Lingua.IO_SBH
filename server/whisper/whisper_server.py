import whisper
from fastapi import FastAPI, UploadFile
from fastapi import Form, File
from difflib import SequenceMatcher
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")  # You can use "small", "medium", or "large"

@app.post("/transcribe")
async def transcribe(file: UploadFile):
    contents = await file.read()
    with open("temp.wav", "wb") as f:
        f.write(contents)
    result = model.transcribe("temp.wav")
    return {"text": result["text"]}

# Input model
class TextInput(BaseModel):
    text: str
    language: str = "en-US"

# POST endpoint to check grammar
@app.post("/grammar-check")
async def grammar_check(data: TextInput):
    # Forward request to local LanguageTool instance
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8010/v2/check",
            data={
                "text": data.text,
                "language": data.language
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
    return response.json()

@app.post("/evaluate-pronunciation")
async def evaluate_pronunciation(file: UploadFile = File(...), expected_text: str = Form(...)):
    # Save uploaded audio
    contents = await file.read()
    with open("temp.wav", "wb") as f:
        f.write(contents)

    # Call existing Whisper model directly (reusing logic from /transcribe)
    result = model.transcribe("temp.wav")
    actual_text = result["text"].strip()

    # Word-level comparison
    expected_words = expected_text.lower().split()
    actual_words = actual_text.lower().split()

    matcher = SequenceMatcher(None, expected_words, actual_words)
    differences = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag != "equal":
            differences.append({
                "type": tag,
                "expected": expected_words[i1:i2],
                "actual": actual_words[j1:j2]
            })

    return {
        "transcript": actual_text,
        "differences": differences
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6500)
