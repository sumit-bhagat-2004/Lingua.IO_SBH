import httpx
from .memory.py import get_conversation, add_message

async def generate_response(session_id: str, user_input: str):
    add_message(session_id, "user", user_input)
    context = get_conversation(session_id)

    # Build prompt
    prompt = ""
    for msg in context:
        prompt += f"{msg['role'].capitalize()}: {msg['content']}\n"
    prompt += "Assistant:"

    # Call Ollama
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama2", "prompt": prompt, "stream": False},
            timeout=60.0
        )

    reply = response.json()["response"].strip()
    add_message(session_id, "assistant", reply)
    return reply
