from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "mistralai/Mistral-7B-Instruct-v0.3"

tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float32)

chat_history = []

def generate_reply(user_input):
    global chat_history

    chat_history.append(f"<s>[INST] {user_input} [/INST]")

    prompt = " ".join(chat_history)

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        pad_token_id=tokenizer.eos_token_id
    )

    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    response = output_text.replace(prompt, "").strip()
    chat_history.append(response)

    return response
