import { useEffect, useState } from "react";

import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";

import {
    getDeletePreview,
    deleteProduct,
} from "../../services/productService";

import type {
    Product,
    DeletePreview,
} from "../../../auth/types";

interface DeleteProductFormProps {
    product: Product;
    onClose: () => void;
    onProductsChange?: () => void;
}

export default function DeleteProductForm({
    product,
    onClose,
    onProductsChange,
}: DeleteProductFormProps) {

    const [preview, setPreview] =
        useState<DeletePreview | null>(null);

    const [loading, setLoading] = useState(true);

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        async function loadPreview() {
            try {
                const data =
                    await getDeletePreview(product.id);

                setPreview(data);
            }
            catch (err) {
                console.error(err);
                alert("Failed to load product information.");
            }
            finally {
                setLoading(false);
            }
        }

        loadPreview();
    }, [product.id]);

    const handleDelete = async () => {
        try {

            await deleteProduct(product.id);

            alert("Product deleted.");

            onProductsChange?.();

            onClose();

        }
        catch (err) {
            console.error(err);

            alert("Failed to delete product.");
        }
    };

    if (loading)
        return <Card>Loading...</Card>;

    if (!preview)
        return <Card>Unable to load preview.</Card>;

    return (
        <>
            <Card>

                <div className="flex flex-col gap-4">

                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">

                        <h3 className="mb-2 text-lg font-semibold text-red-700">

                            Delete Product

                        </h3>

                        <p><strong>Name:</strong> {preview.product.name}</p>

                        <p><strong>Category:</strong> {preview.product.sub_category}</p>

                        <p><strong>Consumable:</strong> {preview.product.is_consumable ? "Yes" : "No"}</p>

                        <p><strong>Current Stock:</strong> {preview.product.current_stock}</p>

                        <p><strong>Status:</strong> {preview.product.status}</p>

                        <p><strong>Description:</strong> {preview.product.description}</p>

                    </div>

                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

                        <h3 className="font-semibold text-yellow-700">

                            This product contains:

                        </h3>

                        <p>

                            Audit Logs:
                            <strong>
                                {" "}
                                {preview.audit_log_count}
                            </strong>

                        </p>

                        <p>

                            Active Borrowings:
                            <strong>
                                {" "}
                                {preview.active_borrowing_count}
                            </strong>

                        </p>

                    </div>

                    <button
                        className="rounded bg-red-600 py-2 text-white hover:bg-red-700"
                        onClick={() => setPopupOpen(true)}
                    >
                        Delete Product
                    </button>

                </div>

            </Card>

            {popupOpen && (

                <Popup
                    onClose={() => setPopupOpen(false)}
                    borderColorClass="border-red-500"
                    confirmationLogic={handleDelete}
                    message={
                        <div>

                            <h3 className="font-bold mb-2">

                                Confirm Product Deletion

                            </h3>

                            <p>

                                This will permanently delete

                                <strong> {preview.product.name}</strong>

                            </p>

                            <p className="mt-2">

                                Audit Logs:
                                <strong>
                                    {" "}
                                    {preview.audit_log_count}
                                </strong>

                            </p>

                            <p>

                                Active Borrowings:
                                <strong>
                                    {" "}
                                    {preview.active_borrowing_count}
                                </strong>

                            </p>

                            <p className="mt-4 text-red-600">

                                This action cannot be undone.

                            </p>

                        </div>
                    }
                />

            )}

        </>
    );
}