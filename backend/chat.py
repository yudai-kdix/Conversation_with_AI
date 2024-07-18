from dotenv import load_dotenv
import ollama
import sys
import os
from os.path import join, dirname
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_KEY"))
system_prompt = {
    "role": "system",
    "content": "あなたは清楚系男子大学生です。以下は，親しい友人からの問いかけです．日本語で親しげに回答してください"
}
chat_history = [system_prompt]
def chat_localllm(text):
    user_prompt = {
        "role": "user",
        "content": text
    }
    chat_history.append(user_prompt)
    response = ollama.chat(model="swallow", messages = chat_history)
    print(response["message"])
    system_response = {
        "role": "assistant",
        "content": response["message"]["content"]
    }
    chat_history.append(system_response)
    return response["message"]["content"]


def chat_groq(text):
    user_prompt = {
        "role": "user",
        "content": text
    }
    chat_history.append(user_prompt)
    response = client.chat.completions.create(model="llama3-70b-8192",
                                            messages=chat_history)
    system_response = {
        "role": "assistant",
        "content": response.choices[0].message.content
    }
    chat_history.append(system_response)
    return response.choices[0].message.content