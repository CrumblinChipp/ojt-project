import { act, useEffect, useState } from "react";

import ProductTable from "../components/productTable";
import ProductForm from "./product/AddProductForm";
import ActionCard from "../components/actionCard";

import { getProducts } from "../services/productService";

import type { Product } from "../../auth/types";


export default function ProductList() {
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

        <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
            onClick={() => setActiveAction('add')}
        >
            Add Product
        </button>
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

