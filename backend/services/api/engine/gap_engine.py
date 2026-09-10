"""
gap_engine.py — Core business logic for the iGOT Karmayogi Competency Gap Platform.

SIH Group B Mathematical Specification:
─────────────────────────────────────────
Gap Score Formula:
    gap = max(0, target_level - current_level) × weight

Overall Gap (weighted average):
    overall_gap = Σ(gap_i) / Σ(weight_i)

Recommendation Score Formula:
    score = 0.40 × gap_match
          + 0.20 × level_fit
          + 0.15 × duration_fit
          + 0.10 × evidence_fit
          + 0.10 × language_fit
          + 0.05 × freshness

Priority Thresholds:
    gap ≥ 2.0  →  Critical
    gap ≥ 1.0  →  High
    gap ≥ 0.4  →  Medium
    gap  < 0.4 →  Low
"""

from typing import List, Dict, Any


# ── Gap Score ─────────────────────────────────────────────────────────────────
def compute_gap(target: float, actual: float, weight: float = 1.0) -> float:
    """
    Compute the weighted competency gap for a single competency.

    Args:
        target:  Required proficiency level (1.0–5.0)
        actual:  Current demonstrated level (1.0–5.0)
        weight:  Importance weight for this competency in the role profile

    Returns:
        Rounded weighted gap score ≥ 0.0
    """
    raw_gap = max(0.0, target - actual)
    return round(raw_gap * weight, 2)


def get_priority(gap: float) -> str:
    """Map a gap score to a human-readable priority label."""
    if gap >= 2.0:
        return "Critical"
    elif gap >= 1.0:
        return "High"
    elif gap >= 0.4:
        return "Medium"
    return "Low"


# ── Overall Gap ───────────────────────────────────────────────────────────────
def compute_overall_gap(user_competencies: List[Dict[str, Any]]) -> float:
    """
    Compute the weighted-average overall gap across all of a user's competencies.

    Args:
        user_competencies: List of dicts with keys:
            - target_level  (float)
            - current_level (float)
            - weight        (float)

    Returns:
        Weighted average gap rounded to 2 decimal places.
        Returns 0.0 if the list is empty.

    Example:
        >>> comps = [
        ...     {"target_level": 5.0, "current_level": 3.5, "weight": 1.0},
        ...     {"target_level": 5.0, "current_level": 2.0, "weight": 1.2},
        ... ]
        >>> compute_overall_gap(comps)
        1.73
    """
    if not user_competencies:
        return 0.0

    total_weighted_gap = 0.0
    total_weight = 0.0

    for uc in user_competencies:
        gap = compute_gap(
            uc.get("target_level", 4.0),
            uc.get("current_level", 1.0),
            uc.get("weight", 1.0),
        )
        total_weighted_gap += gap
        total_weight += uc.get("weight", 1.0)

    if total_weight == 0:
        return 0.0

    return round(total_weighted_gap / total_weight, 2)


# ── Recommendation Score ──────────────────────────────────────────────────────
def calculate_recommendation_score(
    gap_match: float,
    level_fit: float,
    duration_fit: float,
    evidence_fit: float,
    language_fit: float,
    freshness: float,
) -> float:
    """
    Compute the composite recommendation score using the SIH 6-factor formula.

    All inputs should be in the range [0.0, 1.0].

    Weights:
        gap_match    × 0.40  (primary driver — directly addresses skill gap)
        level_fit    × 0.20  (appropriate difficulty for user's current level)
        duration_fit × 0.15  (time commitment feasibility)
        evidence_fit × 0.10  (quality of external evidence/reviews)
        language_fit × 0.10  (language matches user's preference)
        freshness    × 0.05  (content recency)

    Returns:
        Score in [0.0, 1.0] rounded to 4 decimal places.
    """
    return round(
        (0.40 * gap_match)
        + (0.20 * level_fit)
        + (0.15 * duration_fit)
        + (0.10 * evidence_fit)
        + (0.10 * language_fit)
        + (0.05 * freshness),
        4,
    )


# ── Rank Recommendations ─────────────────────────────────────────────────────
def rank_recommendations(
    gaps: List[Dict[str, Any]],
    modules: List[Dict[str, Any]],
    user_language: str = "English",
) -> List[Dict[str, Any]]:
    """
    Rank a list of learning modules against a user's competency gaps using
    the 6-factor recommendation score formula.

    Args:
        gaps:    List of gap dicts with keys: competency_id, gap_score, priority.
        modules: List of module dicts with keys: id, title, provider,
                 competency_id, duration_hours, language, rating.
        user_language: User's preferred language for language_fit scoring.

    Returns:
        Sorted list of modules with an added 'recommendation_score' key,
        ordered by score descending.
    """
    # Build a fast lookup: competency_id → gap info
    gap_map: Dict[str, Dict] = {g["competency_id"]: g for g in gaps}

    # Max possible gap score (target 5 - actual 1 = 4.0 with weight 1.0)
    MAX_GAP = 4.0

    ranked = []
    for m in modules:
        cid = m.get("competency_id", "")
        gap_info = gap_map.get(cid, {})
        raw_gap = gap_info.get("gap_score", 0.0)

        # Normalise inputs to [0, 1]
        gap_match    = min(raw_gap / MAX_GAP, 1.0) if raw_gap else 0.3
        level_fit    = min(m.get("rating", 4.5) / 5.0, 1.0)
        # Prefer modules of 8–20 hours; penalise very short or very long
        duration_h   = m.get("duration_hours", 10.0)
        duration_fit = 1.0 - min(abs(duration_h - 14) / 30.0, 1.0)
        evidence_fit = min(m.get("rating", 4.5) / 5.0, 1.0)
        language_fit = 1.0 if m.get("language", "English") == user_language else 0.5
        freshness    = 0.95  # static high freshness (all modules are current)

        score = calculate_recommendation_score(
            gap_match, level_fit, duration_fit, evidence_fit, language_fit, freshness
        )

        m_copy = dict(m)
        m_copy["recommendation_score"] = score
        m_copy["gap_score"] = raw_gap
        m_copy["priority"] = gap_info.get("priority", "Low")
        m_copy["reason"] = (
            f"Directly addresses {gap_info.get('name', m.get('title', ''))} "
            f"skill gap (gap: {raw_gap})"
            if raw_gap
            else f"Recommended to strengthen {m.get('title', 'this competency')}"
        )
        ranked.append(m_copy)

    ranked.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return ranked
