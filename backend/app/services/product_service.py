from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.product import Product
from app.models.user import User
from app.models.active_borrowing import ActiveBorrowing
from app.models.audit_log import AuditLog
from app.schemas.product import ProductCreate, PullOutRequest, StockInRequest, DeleteRequest

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
    db:Session,
    delete:DeleteRequest
):
    product = (
    db.query(Product)
    .filter(Product.id == delete.product_id)
    .first()
    )
    # Delete borrow records
    db.query(ActiveBorrowing).filter(
        ActiveBorrowing.product_id == product.id
    ).delete()

    # Delete audit logs
    db.query(AuditLog).filter(
        AuditLog.product_id == product.id
    ).delete()

    # Delete the product
    db.delete(product)

    db.commit()
