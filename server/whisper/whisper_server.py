import os
import datetime
import whisper
from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from difflib import SequenceMatcher
import httpx
import google.generativeai as genai
import json
import uvicorn
from dotenv import load_dotenv  # Import dotenv

# Load environment variables from .env file
load_dotenv()

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

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables or .env file.")
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")


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


# === /generate-milestones ===
class MilestoneRequest(BaseModel):
    learningLanguage: str
    currentLevel: str
    goals: list[str]

def add_days(days: int):
    return (datetime.datetime.now() + datetime.timedelta(days=days)).isoformat()

@app.post("/generate-milestones")
async def generate_milestones(preferences: MilestoneRequest):
    try:
        goals_str = ", ".join(preferences.goals)
        prompt = (
            f"Generate at least 10 language learning milestones for someone learning {preferences.learningLanguage}.\n"
            f"Current proficiency level: {preferences.currentLevel}.\n"
            f"Learning goals: {goals_str}.\n"
            f"Milestones should build up in difficulty. "
            f"Respond in JSON format with an array of milestones. "
            f"Each milestone must have: 'title', 'description', and 'dayOffset' (number of days from today)."
        )

        response = gemini_model.generate_content(prompt)

        # Check if the response has a `text` attribute and is not None
        if not hasattr(response, "text") or response.text is None:
            raise HTTPException(status_code=500, detail="Gemini API returned an invalid response.")

        milestones_data = response.text.strip()  # Strip leading/trailing whitespace
        print(type(milestones_data))  # Log the type of the response
        print("RAW GEMINI RESPONSE:\n", milestones_data)  # Log the raw response

        # Ensure the response is not empty
        if not milestones_data:
            raise HTTPException(status_code=500, detail="Gemini API returned an empty response.")

        # Sanitize and validate JSON
        try:
            # Strip leading/trailing whitespace and remove Markdown formatting
            sanitized_data = milestones_data.strip()

            if sanitized_data.startswith("```"):
                lines = sanitized_data.splitlines()
                sanitized_data = "\n".join(lines[1:-1])  # Remove the ```json and ``` lines

            milestones = json.loads(sanitized_data)  # Now safe to parse
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Invalid JSON response: {str(e)}")

        # Process milestones
        for m in milestones:
            m["targetDate"] = add_days(m.pop("dayOffset", 0))

        return {"milestones": milestones}

    except HTTPException as e:
        # Re-raise HTTP exceptions to preserve their status codes
        raise e
    except Exception as e:
        # Catch all other exceptions and return a 500 error
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6500, reload=True)
