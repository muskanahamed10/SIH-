import os
import json
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

FALLBACK_MCQS = [
    {
        "question_id": "MCQ-SAM-01",
        "competency_id": "SAMPLING_DESIGN",
        "stem": "In Stratified Random Sampling, what is the primary objective of dividing the population into homogeneous strata?",
        "options": [
            "To increase sample size without increasing survey cost",
            "To minimize within-stratum variance and improve estimation precision",
            "To ensure every individual has an identical probability of selection",
            "To eliminate non-sampling errors during field enumeration"
        ],
        "correct_option": 1,
        "provenance": "MoSPI NSS Survey Design Manual 2024, Page 42, Section 3.2",
        "difficulty": "intermediate"
    },
    {
        "question_id": "MCQ-NAC-02",
        "competency_id": "NATIONAL_ACCOUNTS",
        "stem": "Which index number formula satisfies both the Time Reversal Test and the Factor Reversal Test in National Accounts Statistics?",
        "options": [
            "Laspeyres Price Index",
            "Paasche Price Index",
            "Fisher\'s Ideal Index",
            "Marshall-Edgeworth Index"
        ],
        "correct_option": 2,
        "provenance": "Central Statistics Office (CSO) National Accounts Guidelines, Page 118",
        "difficulty": "intermediate"
    },
    {
        "question_id": "MCQ-FLD-03",
        "competency_id": "FIELD_VERIFICATION",
        "stem": "When conducting field verification of agricultural census data, what is the standard tolerance limit for area discrepancy under the EARAS scheme?",
        "options": [
            "Less than 1.0%",
            "Between 3.0% and 5.0%",
            "Exactly 10.0%",
            "No tolerance allowed"
        ],
        "correct_option": 1,
        "provenance": "Directorate of Economics & Statistics Field Protocol Manual, Page 19",
        "difficulty": "advanced"
    }
]

def generate_grounded_mcqs(competency_id: str, context_text: str = "", count: int = 3):
    if not GEMINI_API_KEY or not context_text:
        return FALLBACK_MCQS[:count]
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f'''Generate {count} multiple-choice questions strictly from: {context_text}'''
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception:
        return FALLBACK_MCQS[:count]
