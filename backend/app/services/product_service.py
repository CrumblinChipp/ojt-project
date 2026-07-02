from sqlalchemy.orm import Session
from datetime import datetime, timedelta, time, date

from app.models.product import Product
from app.models.user import User
from app.models.active_borrowing import ActiveBorrowing
from app.models.audit_log import AuditLog
from app.schemas.product import ProductCreate, PullOutRequest, StockInRequest, DeleteRequest, ProductUpdate, ReturnProductRequest
from sqlalchemy.orm import joinedload
from sqlalchemy import func



def get_products(
    db: Session,
):
    return (
        db.query(Product)
        .order_by(Product.name.asc())
        .all()
    )

def register_product(
    db: Session,
    product: ProductCreate,
    current_user: User
):
    existing_product = (
        db.query(Product)
        .filter(Product.name == product.name)
        .first()
    )

    if existing_product:
        raise ValueError("This Product Already Exists.")

    try:
        new_product = Product(
            name=product.name,
            is_consumable=product.is_consumable,
            sub_category=product.sub_category,
            max_stock=product.max_stock,
            current_stock=product.current_stock,
            status=product.status,
            description=product.description,
            created_at=datetime.now().isoformat(),
        )

        db.add(new_product)
        db.flush()  # Generates new_product.id without committing

        audit = AuditLog(
            user_id=current_user.id,
            product_id=new_product.id,
            recipient="N/A",
            organization=current_user.organization,
            quantity=product.current_stock,
            action="create_product",
            date=datetime.now().isoformat(),
            description=f"Created product '{product.name}'"
        )

        db.add(audit)

        db.commit()
        db.refresh(new_product)

        return new_product

    except Exception:
        db.rollback()
        raise

def pull_out_product(
    db: Session,
    pull_out: PullOutRequest,
    current_user: User
):
    product = (
        db.query(Product)
        .filter(Product.id == pull_out.product_id)
        .first()
    )
    if product is None:
        raise ValueError("Product not found.")
    
    if pull_out.quantity <= 0:
        raise ValueError("Quantity must be greater than zero.")
    
    if pull_out.quantity > product.current_stock:
        raise ValueError("Insufficient stock for the requested quantity.")
    
    try:
        product.current_stock -= pull_out.quantity
        if product.current_stock == 0:
            product.status = "Out of Stock"
        else:
            product.status = "Available"
            
        db.flush()
        audit = AuditLog(
            user_id=current_user.id,
            product_id=product.id,
            
            recipient=pull_out.recipient,
            organization=pull_out.organization,
            
            quantity=pull_out.quantity,
            
            action="pull_out_product",
            date=datetime.now().isoformat(),
            description=f"Pulled out"
        )
        
        if product.is_consumable == False:
            active_borrowing = ActiveBorrowing(
                user_id=current_user.id,
                product_id=product.id,
                recipient=pull_out.recipient,
                organization=pull_out.organization,
                quantity=pull_out.quantity,
                borrow_date=datetime.now().isoformat(),
                due_date=datetime.now() + timedelta(days=3),
                status="active"
            )
            db.add(active_borrowing)
            

        db.add(audit)
        db.commit()
        db.refresh(product)

        return product
    except Exception:
        db.rollback()
        raise
    
def stock_in_product(
    db: Session,
    stock_in: StockInRequest,
    current_user: User
):
    product = (
        db.query(Product)
        .filter(Product.id == stock_in.product_id)
        .first()
    )
    
    try:
        product.current_stock += stock_in.quantity

        db.flush()
        audit = AuditLog(
            user_id=current_user.id,
            product_id=product.id,
            
            recipient= "N/A",
            organization= "N/A",
            
            quantity=stock_in.quantity,
            
            action="stock_in_product",
            date=datetime.now().isoformat(),
            description=f"Stock In"
        )
        
        db.add(audit)
        db.commit()
        db.refresh(product)

        return product
    except Exception:
        db.rollback()
        raise
    
def delete_product(
    db: Session,
    product_id: int,
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    db.query(ActiveBorrowing).filter(
        ActiveBorrowing.product_id == product.id
    ).delete()

    db.query(AuditLog).filter(
        AuditLog.product_id == product.id
    ).delete()

    db.delete(product)

    db.commit()

    return {"message": "Product deleted successfully"}

def edit_product(
    db: Session,
    edit_product: ProductUpdate,
    current_user: User
):
    product = (
        db.query(Product)
        .filter(Product.id == edit_product.product_id)
        .first()
    )
    if product is None:
        raise ValueError("Product not found.")
    
    try:
        product.name = edit_product.name
        product.is_consumable = edit_product.is_consumable
        product.sub_category = edit_product.sub_category
        product.max_stock = edit_product.max_stock
        product.description = edit_product.description

        db.flush()
        audit = AuditLog(
            user_id=current_user.id,
            product_id=product.id,
            
            recipient="N/A",
            organization=current_user.organization,
            
            quantity=0,
            
            action="edit_product",
            date=datetime.now().isoformat(),
            description=f"Edit product"
        )
        

        db.add(audit)
        db.commit()
        db.refresh(product)

        return product
    except Exception:
        db.rollback()
        raise
    
def return_product(
    db: Session,
    return_request: ReturnProductRequest,
    current_user: User,
):
    borrowing = (
        db.query(ActiveBorrowing)
        .filter(
            ActiveBorrowing.id == return_request.active_borrowing_id
        )
        .first()
    )

    if borrowing is None:
        raise ValueError("Borrowing record not found.")

    product = (
        db.query(Product)
        .filter(Product.id == borrowing.product_id)
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    try:
        product.current_stock += borrowing.quantity

        product.status = (
            "Available"
            if product.current_stock > 0
            else "Out of Stock"
        )

        audit = AuditLog(
            user_id=current_user.id,
            product_id=product.id,
            recipient=borrowing.recipient,
            organization=borrowing.organization,
            quantity=borrowing.quantity,
            action="return_product",
            date=datetime.now(),
            description="Returned product",
        )

        db.add(audit)

        db.delete(borrowing)

        db.commit()
        db.refresh(product)

        return product

    except Exception:
        db.rollback()
        raise
    
def delete_audit_logs(
    db: Session,
    product_id: int,
    start_date: date,
    end_date: date,
):
    
    if start_date > end_date:
        raise ValueError("Start date cannot be after end date.")
    
    start_datetime = datetime.combine(start_date, time.min)
    end_datetime = datetime.combine(end_date, time.max)
    
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    deleted_count = (
        db.query(AuditLog)
        .filter(
            AuditLog.product_id == product_id,
            AuditLog.date >= start_datetime,
            AuditLog.date <= end_datetime,
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return {
        "deleted": deleted_count,
        "message": f"Deleted {deleted_count} audit log(s)."
    }

def get_active_borrowings(
    db: Session,
    product_id: int,
):
    return (
        db.query(ActiveBorrowing)
        .filter(
            ActiveBorrowing.product_id == product_id
        )
        .options(joinedload(ActiveBorrowing.user))
        .order_by(ActiveBorrowing.borrow_date.desc())
        .all()
    )

def get_delete_preview(
    db: Session,
    product_id: int,
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise ValueError("Product not found.")

    audit_count = (
        db.query(func.count(AuditLog.id))
        .filter(AuditLog.product_id == product_id)
        .scalar()
    )

    borrowing_count = (
        db.query(func.count(ActiveBorrowing.id))
        .filter(ActiveBorrowing.product_id == product_id)
        .scalar()
    )

    return {
        "product": product,
        "audit_log_count": audit_count,
        "active_borrowing_count": borrowing_count,
    }