import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_submit_commission_success():
    payload = {
        "service_slug": "custom-game-dev",
        "contact_name": "Test Client",
        "contact_email": "test@example.com",
        "fields": {
            "project_type": "2D Game",
            "description": "I want a fun platformer",
            "budget_range": "$1,000 - $5,000",
            "timeline": "3 months",
        },
        "addons": ["source_code", "extra_revisions"],
    }
    response = client.post("/api/commissions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


def test_submit_commission_invalid_email():
    payload = {
        "service_slug": "custom-game-dev",
        "contact_name": "Test Client",
        "contact_email": "not-an-email",
        "fields": {},
        "addons": [],
    }
    response = client.post("/api/commissions", json=payload)
    assert response.status_code == 422


def test_submit_commission_missing_fields():
    payload = {
        "service_slug": "custom-game-dev",
    }
    response = client.post("/api/commissions", json=payload)
    assert response.status_code == 422