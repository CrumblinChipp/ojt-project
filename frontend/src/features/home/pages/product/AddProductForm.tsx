import { useState } from "react";
import Card from "../../../../components/ui/Card";
import Input from "../../../../components/ui/Input";
import Popup from "../../components/Popup";
import { createProduct } from "../../services/productService";

export default function ProductForm() {

    // 1. Create a single state object to hold all form data
    const [formData, setFormData] = useState({
        name: "",
        is_consumable: false,
        sub_category: "",
        max_stock: "",
        current_stock: "",
        status: "Available",
        description: "",
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // 2. Helper function to update state when an input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                max_stock: Number(formData.max_stock),
                current_stock: Number(formData.current_stock),
            };

            const product = await createProduct(payload);

            console.log("Product created:", product);


            setFormData({
                name: "",
                is_consumable: false,
                sub_category: "",
                max_stock: "",
                current_stock: "",
                status: "Available",
                description: "",
            });
            
            alert("Product created successfully!");
        }
            catch (error: any) {
                console.error(error);

                alert(
                    error.response?.data?.detail ??
                    "Failed to create product."
                );
            }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">
                    {/* Add name and onChange to every Input */}
                    <Input 
                        name="name" 
                        label="Product Name" 
                        placeholder="Enter product name" 
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
                        placeholder="Enter sub category"
                        value={formData.sub_category}
                        onChange={handleChange} 
                    />
                    <Input 
                        name="max_stock" 
                        type="number" 
                        label="Max Stock" 
                        placeholder="Enter quantity" 
                        value={formData.max_stock}
                        onChange={handleChange}
                    />
                    <Input 
                        name="current_stock" 
                        type="number" 
                        label="Current Stock" 
                        placeholder="Enter quantity"
                        value={formData.current_stock}
                        onChange={handleChange}
                    />
                    <Input 
                        name="description" 
                        label="Description" 
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={handleChange} 
                    />
                    <button
                        className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 transition-colors"
                        onClick={() => {
                            if (
                                !formData.name ||
                                !formData.sub_category ||
                                !formData.max_stock ||
                                !formData.current_stock ||
                                !formData.description
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
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="font-bold mb-2">Confirm Submission:</h3>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Category:</strong> {formData.is_consumable ? "Consumable" : "Not Consumable"}</p>
                            <p><strong>Sub Category:</strong> {formData.sub_category}</p>
                            <p><strong>Max Stock:</strong> {formData.max_stock}</p>
                            <p><strong>Current Stock:</strong> {formData.current_stock}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                        </div>
                    }
                    confirmationLogic={handleSubmit}

                    borderColorClass="border-emerald-500"
                />
            )}
        </>
    );
}