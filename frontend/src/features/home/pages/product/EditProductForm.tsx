import { useState } from "react";
import Input from "../../../../components/ui/Input";
import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";
import { editProduct } from "../../services/productService";
import type { Product } from "../../../auth/types";

interface EditProductFormProps {
    product: Product;
    onClose: () => void;
    onProductsChange?: () => void;
}

export default function EditProductForm({
    product,
    onClose,
    onProductsChange,
}: EditProductFormProps) {

    const [formData, setFormData] = useState({
        name: product.name,
        sub_category: product.sub_category,
        is_consumable: product.is_consumable,
        max_stock: product.max_stock,
        description: product.description,
    });

    const [isConsumable, setIsConsumable] = useState(product.is_consumable);
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
                name: formData.name,
                is_consumable: formData.is_consumable,
                sub_category: formData.sub_category,
                max_stock: formData.max_stock,
                description: formData.description,
            };

            const response = await editProduct(payload);

            console.log("Product updated:", response);

            setIsPopupOpen(false);
            onProductsChange?.();
            onClose();

            alert("Product Updated Successfully!");
        } catch (error: any) {
            
            console.error(error);

            alert(
                error.response?.data?.detail ??
                "Failed to update the product."
            );
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">

                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                        <h3 className="mb-2 text-lg font-semibold text-yellow-700">
                            Editing Product
                        </h3>

                        <p>
                            <strong>Current Stock:</strong> {product.current_stock}{" "}
                            <span className="text-sm text-gray-500">
                                (managed via Pull Out / Stock In)
                            </span>
                        </p>
                        <p><strong>Status:</strong> {product.status}</p>
                    </div>

                    <Input
                        name="name"
                        label="Product Name"
                        placeholder={product.name}
                        value={formData.name}
                        onChange={handleChange}
                    />

                    
                    {/* Custom Toggle Switch for Category */}

                    <div className="flex flex-col gap-1.5">

                        <span className="text-sm font-medium text-gray-700">Category</span>

                        <div className="flex items-center gap-3">

                            <button

                                type="button"

                                role="switch"

                                aria-checked={formData.is_consumable}

                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        is_consumable: !formData.is_consumable,
                                    })
                                }

                                className={`

                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2

                                    ${formData.is_consumable ? 'bg-emerald-500' : 'bg-gray-300'}

                                `}

                            >

                                <span className="sr-only">Toggle Consumable</span>

                                <span

                                    className={`

                                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200

                                        ${formData.is_consumable ? 'translate-x-6' : 'translate-x-1'}

                                    `}

                                />

                            </button>

                            <span className="text-sm text-gray-600">

                                {formData.is_consumable ? "Consumable" : "Not Consumable"}

                            </span>

                        </div>

                    </div>

                    <Input
                        name="sub_category"
                        label="Sub Category"
                        placeholder= {product.sub_category}
                        value={formData.sub_category}
                        onChange={handleChange}
                    />

                    <Input
                        name="max_stock"
                        label="Max Stock"
                        type="number"
                        placeholder= "Enter max stock"
                        value={formData.max_stock}
                        onChange={handleChange}
                    />

                    <Input
                        name="description"
                        label="Description"
                        placeholder= {product.description}
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <button
                        className="mt-4 w-full rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
                        onClick={() => {
                            if (!formData.name || !formData.sub_category) {
                                alert("Please fill out all fields.");
                                return;
                            }

                            setIsPopupOpen(true);
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </Card>

            {isPopupOpen && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    borderColorClass="border-indigo-500"
                    confirmationLogic={handleSubmit}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">
                                Confirm Changes:
                            </h3>

                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Consumable:</strong>{formData.is_consumable}</p>
                            <p><strong>Sub Category:</strong> {formData.sub_category}</p>
                            <p><strong>Max Stock:</strong> {formData.max_stock}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                        </div>
                    }
                />
            )}
        </>
    );
}