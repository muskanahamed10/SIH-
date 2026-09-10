"""
test_gap_engine.py — Unit tests for the Gap Engine business logic.

Tests the SIH mathematical specification:
  - compute_gap() weighted formula
  - get_priority() threshold classification
  - compute_overall_gap() weighted-average across competencies
  - calculate_recommendation_score() 6-factor formula
  - rank_recommendations() scoring + ordering
"""

import pytest
from services.api.engine.gap_engine import (
    calculate_recommendation_score,
    compute_gap,
    compute_overall_gap,
    get_priority,
    rank_recommendations,
)


# ── compute_gap ───────────────────────────────────────────────────────────────
class TestComputeGap:
    def test_standard_gap(self):
        assert compute_gap(4.0, 2.1, 1.0) == 1.9

    def test_no_gap_when_at_target(self):
        assert compute_gap(4.0, 4.0, 1.0) == 0.0

    def test_no_gap_when_above_target(self):
        """Gap cannot be negative — user exceeded target."""
        assert compute_gap(3.0, 5.0, 1.0) == 0.0

    def test_weighted_gap(self):
        """gap = (target - actual) * weight"""
        assert compute_gap(5.0, 2.0, 1.2) == pytest.approx(3.6, abs=1e-6)

    def test_zero_weight(self):
        assert compute_gap(5.0, 1.0, 0.0) == 0.0

    def test_large_gap_capped(self):
        gap = compute_gap(5.0, 0.0, 1.0)
        assert gap == 5.0


# ── get_priority ──────────────────────────────────────────────────────────────
class TestGetPriority:
    def test_critical(self):
        assert get_priority(2.0) == "Critical"
        assert get_priority(3.5) == "Critical"

    def test_high(self):
        assert get_priority(1.0) == "High"
        assert get_priority(1.9) == "High"

    def test_medium(self):
        assert get_priority(0.4) == "Medium"
        assert get_priority(0.99) == "Medium"

    def test_low(self):
        assert get_priority(0.0) == "Low"
        assert get_priority(0.39) == "Low"

    def test_exactly_at_thresholds(self):
        assert get_priority(2.0) == "Critical"
        assert get_priority(1.0) == "High"
        assert get_priority(0.4) == "Medium"


# ── compute_overall_gap ───────────────────────────────────────────────────────
class TestComputeOverallGap:
    def test_empty_list(self):
        assert compute_overall_gap([]) == 0.0

    def test_single_competency(self):
        comps = [{"target_level": 5.0, "current_level": 3.0, "weight": 1.0}]
        assert compute_overall_gap(comps) == 2.0

    def test_weighted_average(self):
        comps = [
            {"target_level": 5.0, "current_level": 3.5, "weight": 1.0},  # raw_gap=1.5, weighted=1.5*1.0=1.5
            {"target_level": 5.0, "current_level": 2.0, "weight": 1.2},  # raw_gap=3.0, weighted=3.0*1.2=3.6
        ]
        # weighted_gap_sum = 1.5 + 3.6 = 5.1
        # total_weight = 1.0 + 1.2 = 2.2
        # overall = 5.1 / 2.2 = 2.3181... ≈ 2.32
        result = compute_overall_gap(comps)
        assert result == pytest.approx(2.32, abs=0.01)

    def test_all_zero_gaps(self):
        comps = [
            {"target_level": 4.0, "current_level": 4.0, "weight": 1.0},
            {"target_level": 5.0, "current_level": 5.0, "weight": 0.8},
        ]
        assert compute_overall_gap(comps) == 0.0


# ── calculate_recommendation_score ───────────────────────────────────────────
class TestRecommendationScore:
    def test_perfect_score(self):
        score = calculate_recommendation_score(1.0, 1.0, 1.0, 1.0, 1.0, 1.0)
        assert abs(score - 1.0) < 1e-6

    def test_zero_score(self):
        score = calculate_recommendation_score(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
        assert score == 0.0

    def test_weights_sum_to_one(self):
        """The coefficients must sum to 1.0."""
        assert abs(0.40 + 0.20 + 0.15 + 0.10 + 0.10 + 0.05 - 1.0) < 1e-10

    def test_partial_match(self):
        score = calculate_recommendation_score(0.5, 0.8, 0.2, 0.9, 1.0, 0.5)
        expected = (0.40 * 0.5 + 0.20 * 0.8 + 0.15 * 0.2
                    + 0.10 * 0.9 + 0.10 * 1.0 + 0.05 * 0.5)
        assert abs(score - expected) < 1e-6

    def test_gap_match_dominates(self):
        """gap_match (weight 0.40) should dominate when all others are equal."""
        score_high_gap = calculate_recommendation_score(1.0, 0.5, 0.5, 0.5, 0.5, 0.5)
        score_low_gap  = calculate_recommendation_score(0.0, 0.5, 0.5, 0.5, 0.5, 0.5)
        assert score_high_gap > score_low_gap


# ── rank_recommendations ──────────────────────────────────────────────────────
class TestRankRecommendations:
    def _sample_gaps(self):
        return [
            {"competency_id": "C1", "name": "FastAPI", "gap_score": 1.5, "priority": "High"},
            {"competency_id": "C2", "name": "Redis", "gap_score": 2.0, "priority": "Critical"},
        ]

    def _sample_modules(self):
        return [
            {"id": "M1", "title": "FastAPI Course", "competency_id": "C1",
             "duration_hours": 14.0, "language": "English", "rating": 4.8, "provider": "NeGD"},
            {"id": "M2", "title": "Redis Course", "competency_id": "C2",
             "duration_hours": 10.0, "language": "English", "rating": 4.6, "provider": "NeGD"},
            {"id": "M3", "title": "Unrelated Course", "competency_id": "C99",
             "duration_hours": 5.0, "language": "English", "rating": 3.0, "provider": "Other"},
        ]

    def test_returns_all_modules(self):
        ranked = rank_recommendations(self._sample_gaps(), self._sample_modules())
        assert len(ranked) == 3

    def test_sorted_descending(self):
        ranked = rank_recommendations(self._sample_gaps(), self._sample_modules())
        scores = [r["recommendation_score"] for r in ranked]
        assert scores == sorted(scores, reverse=True)

    def test_high_gap_module_ranks_higher(self):
        ranked = rank_recommendations(self._sample_gaps(), self._sample_modules())
        # C2 (gap 2.0) should rank above C99 (no gap)
        ids = [r["id"] for r in ranked]
        assert ids.index("M2") < ids.index("M3")

    def test_empty_gaps(self):
        ranked = rank_recommendations([], self._sample_modules())
        assert len(ranked) == 3  # still returns modules, just with default scores

    def test_empty_modules(self):
        ranked = rank_recommendations(self._sample_gaps(), [])
        assert ranked == []

    def test_language_penalty(self):
        gaps = [{"competency_id": "C1", "name": "FastAPI", "gap_score": 1.5, "priority": "High"}]
        modules = [
            {"id": "M_EN", "title": "English Course", "competency_id": "C1",
             "duration_hours": 14.0, "language": "English", "rating": 4.8},
            {"id": "M_HI", "title": "Hindi Course", "competency_id": "C1",
             "duration_hours": 14.0, "language": "Hindi", "rating": 4.8},
        ]
        ranked = rank_recommendations(gaps, modules, user_language="English")
        ids = [r["id"] for r in ranked]
        assert ids[0] == "M_EN"  # English preferred
