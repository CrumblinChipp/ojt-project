import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

import ProductTable from "../components/productTable";
import ProductForm from "./product/AddProductForm";
import ActionCard from "../components/actionCard";

import { getProducts } from "../services/productService";

import type { Product } from "../../auth/types";


export default function ProductList() {
    
    const { user: currentUser } = useAuth();
    const [activeAction, setActiveAction] = useState<null | 'add' | 'pull-out'>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return(
    <div>

        {currentUser && currentUser.is_admin && (
            <button 
                className="bg-green-500 text-white px-4 py-2 m-2 rounded hover:bg-green-600 transition-colors mr-2"
                onClick={() => setActiveAction('add')}
            >
                Add Product
            </button>
        )}
        {activeAction && (
            <ActionCard
                    onClose={() => {
                    setActiveAction(null);
                }}
                borderColorClass="border-emerald-500">
                <ProductForm/>
            </ActionCard>
            )}

        <ProductTable products={products} />
        
        </div>
    )
}

