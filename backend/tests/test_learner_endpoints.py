"""
test_learner_endpoints.py — Integration tests verifying FastAPI endpoints that feed the Next.js frontend.
"""

import pytest


class TestLearnerEndpoints:
    def test_learner_dashboard(self, client):
        resp = client.get("/api/learner/dashboard")
        assert resp.status_code == 200
        data = resp.json()
        assert "learner" in data
        assert "kpis" in data
        assert "radarData" in data
        assert "priorityGaps" in data
        assert "recommendations" in data
        assert "learningPath" in data
        assert "recentAssessment" in data
        assert "progressHistory" in data
        assert isinstance(data["radarData"], list)
        assert len(data["radarData"]) >= 1

    def test_learner_competency_profile(self, client):
        resp = client.get("/api/learner/competency")
        assert resp.status_code == 200
        data = resp.json()
        assert "learner" in data
        assert "summary" in data
        assert "radarData" in data
        assert "competenciesTable" in data
        assert "priorityGaps" in data
        assert "competencyLoopStages" in data

    def test_learner_baseline_assessment(self, client):
        resp = client.get("/api/learner/assessment/baseline-test-01")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == "baseline-test-01"
        assert "title" in data
        assert "questions" in data
        assert isinstance(data["questions"], list)
        assert len(data["questions"]) >= 1
        q0 = data["questions"][0]
        assert "id" in q0
        assert "question" in q0
        assert "options" in q0
        assert "correctOptionId" in q0

    def test_learner_assessment_submit(self, client):
        resp = client.post(
            "/api/learner/assessment/baseline-test-01/submit",
            json={
                "answers": {
                    "MCQ-BE-001": "B"
                },
                "timeSpentSeconds": 45
            }
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "overallScore" in data
        assert "correctCount" in data
        assert "competencyScores" in data
        assert data["correctCount"] >= 1

    def test_learner_assessment_results(self, client):
        resp = client.get("/api/learner/results/baseline-test-01")
        assert resp.status_code == 200
        data = resp.json()
        assert "overallScore" in data
        assert "competencyPerformance" in data
        assert "radarData" in data
        assert "topPriorityGaps" in data
        assert "aiInsight" in data
        assert "questionsReview" in data

    def test_learner_recommendations(self, client):
        resp = client.get("/api/learner/recommendations")
        assert resp.status_code == 200
        data = resp.json()
        assert "role" in data
        assert "priorityArea" in data
        assert "gapChips" in data
        assert "orderQueue" in data
        assert "resources" in data
        assert isinstance(data["resources"], list)
        assert len(data["resources"]) >= 1

    def test_learner_learning_path(self, client):
        resp = client.get("/api/learner/learning-path")
        assert resp.status_code == 200
        data = resp.json()
        assert "learnerName" in data
        assert "items" in data
        assert "whyThisOrder" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) >= 1

    def test_learner_resource_by_id(self, client):
        resp = client.get("/api/learner/resources/MOD-BE-001")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == "MOD-BE-001"
        assert "title" in data
        assert "competencyId" in data
        assert "detailedReasoning" in data
