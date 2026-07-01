import { useState } from 'react';
import type { Product } from "../../auth/types";
import PullOutForm from "../pages/product/PullOutForm";
import StockInForm from '../pages/product/StockInForm';
import ActionCard from './actionCard';
  


interface ProductTableProps {
    products: Product[];
}

export default function ProductTable({
    products,
}: ProductTableProps) {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeAction, setActiveAction] = useState<null | 'audit' | 'pull-out' | 'stock-in' | 'return' | 'delete'>(null);

    return (
      <>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-500 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Sub Category</th>
                        <th className="px-4 py-3 text-center">Quantity</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-4 py-3">
                                    {product.name}
                                </td>

                                <td className="px-4 py-3">
                                    {product.sub_category}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {product.current_stock}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {product.status}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button className="rounded bg-emerald-500 px-3 py-1 mx-1 text-white hover:bg-emerald-600"
                                        onClick={() => {setSelectedProduct(product); setActiveAction('pull-out');}}
                                    >
                                        P
                                    </button>
                                    <button className="rounded bg-blue-500 px-3 py-1 mx-1 text-white hover:bg-blue-600"
                                        onClick={() => {setSelectedProduct(product); setActiveAction('audit')}}
                                    >
                                        A
                                    </button>
                                    <button className="rounded bg-yellow-500 px-3 py-1 mx-1 text-white hover:bg-yellow-600"
                                        onClick={() => {setSelectedProduct(product); setActiveAction('stock-in')}}
                                    >
                                        S
                                    </button>
                                    
                                    {!product.is_consumable && (
                                        <button
                                            className="rounded bg-orange-500 px-3 py-1 mx-1 text-white hover:bg-orange-600"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setActiveAction("return");
                                            }}
                                        >
                                            R
                                        </button>
                                    )}
                                    <button
                                        className="rounded bg-red-500 px-3 py-1 mx-1 text-white hover:bg-red-600"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setActiveAction("delete");
                                        }}
                                    >
                                        D
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        {selectedProduct && activeAction && (
            <ActionCard
                onClose={() => {
                    setSelectedProduct(null);
                    setActiveAction(null);
                }}
                borderColorClass="border-emerald-500"
            >
                {activeAction === "pull-out" && (
                    <PullOutForm
                        product={selectedProduct}
                        onClose={() => {
                            setSelectedProduct(null);
                            setActiveAction(null);
                        }}
                    />
                )}

                {activeAction === "stock-in" && (
                    <StockInForm
                        product={selectedProduct}
                        onClose={() => {
                            setSelectedProduct(null);
                            setActiveAction(null);
                        }}
                    />
                )}
            </ActionCard>
        )}
      </>
    );
}