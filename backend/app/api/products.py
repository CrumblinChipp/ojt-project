from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
import traceback

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.schemas.active_borrowing import ActiveBorrowingResponse
from app.schemas.product import ProductCreate, ProductResponse, PullOutRequest, StockInRequest, DeleteRequest, ProductUpdate, ReturnProductRequest, DeleteProductPreview
from app.services.product_service import register_product, pull_out_product, get_products, stock_in_product, get_active_borrowings, get_delete_preview, delete_audit_logs
from app.services.audit_service import get_audit_logs

from app.services.product_service import (
    edit_product as edit_product_service,
    delete_product as delete_product_service,
    return_product as return_product_service,
)
router = APIRouter(
    prefix="/products",
    tags=["Products"],
)

@router.post(
    "/create-product",
    response_model=ProductResponse,
    status_code=201,
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return register_product(
            db=db,
            product=product,
            current_user=current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.post(
    "/pull-out",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
)
def pull_out(
    pull_out: PullOutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return pull_out_product(
            db=db,
            pull_out=pull_out,
            current_user=current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise
        

@router.post(
    "/stock-in",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
)
def stock_in(
    stock_in: StockInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return stock_in_product(
            db=db,
            stock_in=stock_in,
            current_user=current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise
        

@router.post(
    "/return-product",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
)
def return_product_route(
    return_request: ReturnProductRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return return_product_service(
            db=db,
            return_request=return_request,
            current_user=current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise


@router.put(
    "/edit-product",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
)
def edit_product_route(
    edit_product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return edit_product_service(
            db=db,
            edit_product=edit_product,
            current_user=current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise

@router.delete("/{product_id}")
def delete_product_route(
    product_id: int,
    db: Session = Depends(get_db),
):
    try:
        return delete_product_service(
            db=db,
            product_id=product_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise

@router.delete("/{product_id}/audit-logs")
def delete_product_audit_logs(
    product_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
):
    try:
        return delete_audit_logs(
            db=db,
            product_id=product_id,
            start_date=start_date,
            end_date=end_date,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception:
        traceback.print_exc()
        raise

@router.get(
    "/",
    response_model=list[ProductResponse],
)
def get_all_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_products(db)


@router.get("/{product_id}/audit-log", response_model=list[AuditLogResponse])
def get_product_audit_logs(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_audit_logs(db, product_id)

@router.get(
    "/{product_id}/active-borrowings",
    response_model=list[ActiveBorrowingResponse],
)
def get_product_active_borrowings(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_active_borrowings(
        db=db,
        product_id=product_id,
    )
    
@router.get(
    "/{product_id}/delete-preview",
    response_model=DeleteProductPreview,
)
def delete_preview(
    product_id: int,
    db: Session = Depends(get_db),
):
    return get_delete_preview(
        db=db,
        product_id=product_id,
    )