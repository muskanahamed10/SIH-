def compute_competency_gap(target_level: float, demonstrated_level: float, weight: float = 1.0) -> float:
    raw_gap = max(0.0, target_level - demonstrated_level)
    return round(raw_gap * weight, 2)

def calculate_priority(gap: float) -> str:
    if gap >= 2.0:
        return "Critical"
    elif gap >= 1.0:
        return "High"
    elif gap >= 0.4:
        return "Medium"
    else:
        return "Low"

def compute_recommendation_score(gap_match: float, level_fit: float, duration_fit: float, evidence_fit: float, language_fit: float, quality: float) -> float:
    score = (
        0.40 * gap_match +
        0.20 * level_fit +
        0.15 * duration_fit +
        0.10 * evidence_fit +
        0.10 * language_fit +
        0.05 * quality
    )
    return round(score, 4)
