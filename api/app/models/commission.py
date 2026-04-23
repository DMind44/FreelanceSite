from pydantic import BaseModel, EmailStr


class CommissionSubmission(BaseModel):
    service_slug: str
    contact_name: str
    contact_email: EmailStr
    fields: dict[str, str | list[str]]
    addons: list[str] = []


class CommissionResponse(BaseModel):
    status: str
    message: str