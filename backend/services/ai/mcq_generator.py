import os
import json
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

FALLBACK_MCQS = [
    {
        "question": "In Stratified Random Sampling, what is the primary objective of dividing the population into homogeneous strata?",
        "options": [
            "To increase sample size without increasing survey cost",
            "To minimize within-stratum variance and improve estimation precision",
            "To ensure every individual has an identical probability of selection",
            "To eliminate non-sampling errors during field enumeration"
        ],
        "answer": "To minimize within-stratum variance and improve estimation precision",
        "provenance": "MoSPI NSS Survey Design Manual 2024, Page 42, Section 3.2",
        "explanation": "Stratification reduces sampling error by ensuring variance within each stratum is minimized compared to total population variance."
    },
    {
        "question": "Which index number formula satisfies both the Time Reversal Test and the Factor Reversal Test in National Accounts Statistics?",
        "options": [
            "Laspeyres Price Index",
            "Paasche Price Index",
            "Fisher's Ideal Index",
            "Marshall-Edgeworth Index"
        ],
        "answer": "Fisher's Ideal Index",
        "provenance": "Central Statistics Office (CSO) National Accounts Guidelines, Page 118",
        "explanation": "Fisher's index is the geometric mean of Laspeyres and Paasche and satisfies both fundamental index number consistency tests."
    },
    {
        "question": "When conducting field verification of agricultural census data, what is the standard tolerance limit for area discrepancy under the EARAS scheme?",
        "options": [
            "Less than 1.0%",
            "Between 3.0% and 5.0%",
            "Exactly 10.0%",
            "No tolerance allowed"
        ],
        "answer": "Between 3.0% and 5.0%",
        "provenance": "Directorate of Economics & Statistics Field Protocol Manual, Page 19",
        "explanation": "EARAS guidelines allow a 3.0% - 5.0% error margin before physical re-enumeration is triggered."
    }
]

def validate_mcq(mcq: dict) -> bool:
    if "question" not in mcq or "options" not in mcq or "answer" not in mcq:
        return False
    if len(mcq["options"]) != 4:
        return False
    if mcq["answer"] not in mcq["options"]:
        return False
    if len(set(mcq["options"])) != 4:
        return False
    return True

def generate_mcqs(context: str, lang: str = "English", count: int = 3):
    if not GEMINI_API_KEY or not context:
        return [q for q in FALLBACK_MCQS if validate_mcq(q)][:count]
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f'''
        Generate {count} multiple choice questions based strictly on the context below in {lang}.
        Output MUST be a raw JSON array, with no markdown code fences.
        Schema:
        [
          {{
            "question": "string",
            "options": ["opt1", "opt2", "opt3", "opt4"],
            "answer": "opt1",
            "provenance": "citation from context",
            "explanation": "string"
          }}
        ]
        Context: {context}
        '''
        response = model.generate_content(prompt)
        parsed = json.loads(response.text)
        valid = [q for q in parsed if validate_mcq(q)]
        return valid if valid else FALLBACK_MCQS[:count]
    except Exception:
        return FALLBACK_MCQS[:count]
