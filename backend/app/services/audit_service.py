from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from sqlalchemy.orm import joinedload

def get_audit_logs(db: Session, product_id: int):
    return (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .filter(AuditLog.product_id == product_id)
        .all()
    )