from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import traceback

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, PullOutRequest, StockInRequest, DeleteRequest
from app.services.product_service import register_product, pull_out_product, get_products, stock_in_product

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
        

@router.delete("/{product_id}")
def delete_product(
    delete_request: DeleteRequest,
    db: Session = Depends(get_db),
):
    try:
        return delete_product(
            db=db,
            delete_request=delete_request,
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