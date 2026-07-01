import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import Input from "../../../../components/ui/Input";
import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";
import { pullOutProduct } from "../../services/productService";
import type { Product } from "../../../auth/types";

interface PullOutFormProps {
    product: Product;
    onClose: () => void;
}

export default function PullOutForm({
    product,
    onClose,
}: PullOutFormProps) {

    const { user } = useAuth();

    const [formData, setFormData] = useState({
        recipient: "",
        organization: "",
        quantity: "",
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                product_id: product.id,
                recipient: formData.recipient,
                organization: formData.organization,
                quantity: Number(formData.quantity),
            };

            // Replace createProduct() with your future pull-out API
            const response = await pullOutProduct(payload);

            console.log("Product pulled out:", response);

            setFormData({
                recipient: "",
                organization: "",
                quantity: "",
            });

            setIsPopupOpen(false);
            onClose();

            alert("Pull Out Request Successful!");
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.detail ??
                "Failed to make the request."
            );
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">

                    {/* Product Information */}
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <h3 className="mb-2 text-lg font-semibold text-emerald-700">
                            Product Information
                        </h3>

                        <p><strong>Name:</strong> {product.name}</p>
                        <p><strong>Category:</strong> {product.sub_category}</p>
                        <p><strong>Current Stock:</strong> {product.current_stock}</p>
                        <p><strong>Status:</strong> {product.status}</p>
                    </div>

                    <Input
                        name="recipient"
                        label="Recipient"
                        placeholder="Enter Recipient"
                        value={formData.recipient}
                        onChange={handleChange}
                    />

                    <Input
                        name="organization"
                        label="Organization"
                        placeholder="Organization"
                        value={formData.organization}
                        onChange={handleChange}
                    />

                    <Input
                        name="quantity"
                        type="number"
                        label="Quantity"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />

                    <button
                        className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2 text-white transition-colors hover:bg-emerald-600"
                        onClick={() => {
                            if (
                                !formData.recipient ||
                                !formData.organization ||
                                !formData.quantity
                            ) {
                                alert("Please fill out all fields.");
                                return;
                            }

                            setIsPopupOpen(true);
                        }}
                    >
                        Submit
                    </button>
                </div>
            </Card>

            {isPopupOpen && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    borderColorClass="border-emerald-500"
                    confirmationLogic={handleSubmit}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">
                                Confirm Submission:
                            </h3>

                            <p><strong>Product:</strong> {product.name}</p>
                            <p><strong>Current Stock:</strong> {product.current_stock}</p>

                            <hr className="my-2" />

                            <p><strong>Recipient:</strong> {formData.recipient}</p>
                            <p><strong>Organization:</strong> {formData.organization}</p>
                            <p><strong>Quantity:</strong> {formData.quantity}</p>
                            <p><strong>Staff Handler:</strong> {user?.name}</p>
                        </div>
                    }
                />
            )}
        </>
    );
}