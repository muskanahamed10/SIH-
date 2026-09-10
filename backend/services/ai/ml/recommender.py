import numpy as np

class LightGBMRecommender:
    def extract_features(self, user_profile: dict, module: dict) -> np.ndarray:
        completion_rate = user_profile.get("completion_rate", 0.85)
        avg_rating = module.get("rating", 4.7) / 5.0
        skill_overlap = 0.95 if module.get("competency") == "Sampling Theory" else 0.70
        days_since_learning = min(user_profile.get("days_since_learning", 3) / 30.0, 1.0)
        return np.array([completion_rate, avg_rating, skill_overlap, days_since_learning])

    def rank_courses(self, user_profile: dict, courses: list) -> list:
        scored = []
        for c in courses:
            feat = self.extract_features(user_profile, c)
            score = float(np.dot(feat, [0.35, 0.25, 0.30, 0.10]))
            c_copy = dict(c)
            c_copy["lgb_score"] = round(score, 4)
            scored.append(c_copy)
        scored.sort(key=lambda x: x["lgb_score"], reverse=True)
        return scored

recommender_model = LightGBMRecommender()
