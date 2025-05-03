# Handles conversation history (simple in-memory dict)

conversation_memory = {}

MAX_HISTORY = 10  # max number of exchanges to remember

def add_message(session_id: str, role: str, content: str):
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    conversation_memory[session_id].append({"role": role, "content": content})
    if len(conversation_memory[session_id]) > MAX_HISTORY:
        conversation_memory[session_id] = conversation_memory[session_id][-MAX_HISTORY:]

def get_conversation(session_id: str):
    return conversation_memory.get(session_id, [])
