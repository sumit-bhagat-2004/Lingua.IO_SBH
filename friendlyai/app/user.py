user_histories = {}

def get_history(user_id):
    return user_histories.setdefault(user_id, [])

def append_to_history(user_id, message):
    user_histories[user_id].append(message)
