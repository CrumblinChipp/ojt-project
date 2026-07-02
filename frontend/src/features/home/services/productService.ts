import api from "../../../lib/api.ts";
export const createProduct = async (productData: any) => {
    const response = await api.post(
        "/products/create-product",
        productData
    );

    return response.data;
};

export const pullOutProduct = async (productData: any) => {
    const response = await api.post(
        "/products/pull-out",
        productData
    );

    return response.data;
};

export const editProduct = async (productData: any) => {
    const response = await api.put(
        "/products/edit-product",
        productData
    );

    return response.data;
};

export const StockInProduct = async (productData: any) => {
    const response = await api.post(
        "/products/stock-in",
        productData
    )

    return response.data;
};

export const returnProduct = async (activeBorrowingId: number) => {
    const response = await api.post(
        "/products/return-product",
        {
            active_borrowing_id: activeBorrowingId,
        }
    );

    return response.data;
};

export const getDeletePreview = async (productId: number) => {
    const response = await api.get(
        `/products/${productId}/delete-preview`
    );

    return response.data;
};

export const deleteProduct = async (productId: number) => {
    const response = await api.delete(
        `/products/${productId}`
    );

    return response.data;
};

export const deleteAuditLogs = async (payload: {
    product_id: number;
    start_date: string;
    end_date: string;
}) => {
    const response = await api.delete(`/products/${payload.product_id}/audit-logs`, {
        params: { start_date: payload.start_date, end_date: payload.end_date },
    });
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get("/products");

    return response.data;
};

export const getAuditLogs = async (productId: number) => {
    const response = await api.get(`/products/${productId}/audit-log`);
    return response.data;
};

export const getActiveBorrowings = async (productId: number) => {
    const response = await api.get(
        `/products/${productId}/active-borrowings`
    );

    return response.data;
};