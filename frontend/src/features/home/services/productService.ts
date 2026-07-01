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

export const StockInProduct = async (productData: any) => {
    const response = await api.post(
        "/products/stock-in",
        productData
    )

    return response.data;
};

export const deleteProduct = async (productId: number) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get("/products");

    return response.data;
};