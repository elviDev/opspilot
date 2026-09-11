"""
Handles all calls to the Gemini API: summarizing incidents in plain language
and answering free-form questions about service history.
"""

import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
MODEL = "gemini-3.6-flash"

model = genai.GenerativeModel(MODEL)


def summarize_incident(service_name: str, error_message: str, language: str = "en") -> str:
    prompt = f"""You are an assistant helping an application support engineer understand a production incident.

Service: {service_name}
Error details: {error_message}

Write a short, plain-language summary (3-4 sentences max) covering:
1. What likely broke
2. The probable cause
3. One concrete next step to investigate

Respond in this language: {language}. Do not use technical jargon unless necessary."""

    response = model.generate_content(prompt)
    return response.text


def answer_question(question: str, context: str, language: str = "en") -> str:
    prompt = f"""You are OpsPilot, an AI assistant inside a monitoring dashboard. Answer the user's
question using only the incident and check history provided below. If the answer isn't in the
data, say so honestly rather than guessing.

Incident and check history:
{context}

Question: {question}

Respond in this language: {language}. Keep the answer concise and direct."""

    response = model.generate_content(prompt)
    return response.text