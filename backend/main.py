from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/travel")
async def get_travel_plan(request: PromptRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a friendly, expert travel agent."},
                {"role": "user", "content": request.prompt}
            ],
            temperature=0.8,
            max_tokens=800
        )
        return {"reply": response['choices'][0]['message']['content']}
    except Exception as e:
        return {"error": str(e)}
