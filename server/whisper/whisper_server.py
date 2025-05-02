import whisper
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6500)
