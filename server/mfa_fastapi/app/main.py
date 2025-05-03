from fastapi import FastAPI, File, UploadFile
import os
import shutil
import subprocess
import uuid

app = FastAPI()

@app.get("/")
def root():
    return {"message": "MFA API is running."}

@app.post("/align")
async def align_audio(audio: UploadFile = File(...), transcript: UploadFile = File(...)):
    uid = str(uuid.uuid4())
    input_dir = f"/tmp/mfa_{uid}"
    os.makedirs(f"{input_dir}/wavs", exist_ok=True)
    os.makedirs(f"{input_dir}/txts", exist_ok=True)
    os.makedirs(f"{input_dir}/output", exist_ok=True)

    wav_path = f"{input_dir}/wavs/{audio.filename}"
    txt_path = f"{input_dir}/txts/{transcript.filename}"

    with open(wav_path, "wb") as f:
        f.write(await audio.read())

    with open(txt_path, "wb") as f:
        f.write(await transcript.read())

    try:
        subprocess.run([
            "mfa", "align",
            f"{input_dir}/wavs",
            f"{input_dir}/txts",
            "english",
            f"{input_dir}/output"
        ], check=True)

        output_file = os.path.join(f"{input_dir}/output", audio.filename.replace(".wav", ".TextGrid"))
        if os.path.exists(output_file):
            with open(output_file, "r") as f:
                result = f.read()
            return {"success": True, "textgrid": result}
        else:
            return {"success": False, "error": "TextGrid not found"}
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": str(e)}
    finally:
        shutil.rmtree(input_dir, ignore_errors=True)
