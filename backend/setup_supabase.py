import os
import sys
from services.api.core.database import engine, Base, SessionLocal
from services.api.core.seed import seed_m3_data
from services.api.models.models import (
    User, Role, Competency, RoleCompetency, UserCompetency,
    Evidence, Assessment, MCQQuestion, LearningModule,
    Recommendation, LearningPath, AuditLog
)

def init_supabase():
    print(f"Connecting to database via engine: {engine.url.render_as_string(hide_password=True)}")
    try:
        # Test connection
        with engine.connect() as conn:
            print("Successfully established database connection.")

        # Create all 12 canonical tables
        print("Creating all 12 tables in Supabase / PostgreSQL...")
        Base.metadata.create_all(bind=engine)
        print("All tables successfully created in Supabase.")

        # Seed initial data
        print("Seeding initial M3 demo data...")
        db = SessionLocal()
        seed_m3_data(db)
        db.close()
        print("M3 initial dataset seeded successfully.")
        print("\nAll done! Your Supabase database is ready to use.")

    except Exception as e:
        print(f"\nConnection / Initialization failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    init_supabase()
