    import { useState } from 'react';
    import { useAuth } from '../../../hooks/useAuth';
    import type { Product } from "../../auth/types";
    import PullOutForm from "../pages/product/PullOutForm";
    import StockInForm from '../pages/product/StockInForm';
    import EditProductForm from '../pages/product/EditProductForm';
    import ActionCard from './actionCard';
    import AuditLogTable from '../pages/product/auditLogTable';  
    import ReturnItemsList from '../pages/product/ReturnItemList';
    import DeleteProductForm from '../pages/product/DeleteConfirm';


    interface ProductTableProps {
        products: Product[];
    }

    export default function ProductTable({
        products,
    }: ProductTableProps) {

        const [search, setSearch] = useState("");
        const { user: currentUser } = useAuth();
        const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
        const [activeAction, setActiveAction] = useState<null | 'audit' | 'pull-out' | 'stock-in' | 'return' | 'delete' | 'edit'>(null);


        const isUnavailable = (product: Product) => {
            return product.current_stock === 0;
        };

        const getRowClass = (product: Product) => {
            if (product.current_stock === 0) {
                // Out of stock
                return "bg-red-100";
            }

            if (product.current_stock <= product.max_stock / 2) {
                // Below half stock
                return "bg-yellow-100";
            }

            return "bg-white";
        };

        const filteredProducts = products.filter((product) => {
            const query = search.toLowerCase().trim();

            return (
                product.name.toLowerCase().includes(query) ||
                product.sub_category.toLowerCase().includes(query)
            );
        });


        return (
        <>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product or subcategory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                />
            </div>

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
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className={getRowClass(product)}
                                >
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
                                        <button
                                            title={isUnavailable(product) ? "Currently Unavailable" : "Pull Out"}
                                            disabled={isUnavailable(product)}
                                            className={`rounded px-3 py-1 mx-1 text-white
                                                ${
                                                    isUnavailable(product)
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-emerald-500 hover:bg-emerald-600"
                                                }`}
                                            onClick={() => {
                                                if (isUnavailable(product)) return;

                                                setSelectedProduct(product);
                                                setActiveAction("pull-out");
                                            }}
                                        >
                                            P
                                        </button>

                                        <button title="Audit Log" className="rounded bg-blue-500 px-3 py-1 mx-1 text-white hover:bg-blue-600"
                                            onClick={() => {setSelectedProduct(product); setActiveAction('audit')}}
                                        >
                                            A
                                        </button>
                                        <button title="Stock In" className="rounded bg-purple-500 px-3 py-1 mx-1 text-white hover:bg-purple-600"
                                            onClick={() => {setSelectedProduct(product); setActiveAction('stock-in')}}
                                        >
                                            S
                                        </button>
                                        
                                        {!product.is_consumable && (
                                            <button title="Return"
                                                className="rounded bg-orange-500 px-3 py-1 mx-1 text-white hover:bg-orange-600"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setActiveAction("return");
                                                }}
                                            >
                                                R
                                            </button>
                                        )}

                                        {currentUser?.is_admin && (
                                            <div>
                                                <button title="Edit Product"
                                                    className="rounded bg-yellow-500 px-3 py-1 mx-1 my-1 text-white hover:bg-yellow-600"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setActiveAction("edit");
                                                    }}
                                                >
                                                    E
                                                </button>

                                                <button title="Delete Product"
                                                    className="rounded bg-red-500 px-3 py-1 mx-1 my-1 text-white hover:bg-red-600"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setActiveAction("delete");
                                                    }}
                                                >
                                                    D
                                                </button>
                                            </div>
                                            
                                        )}
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
                    {activeAction === "audit" && (
                        <AuditLogTable
                            onClose={() => {
                                setSelectedProduct(null);
                                setActiveAction(null);
                            }}
                            product={selectedProduct}
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

                    {activeAction === "edit" && (
                        <EditProductForm
                            product={selectedProduct}
                            onClose={() => {
                                setSelectedProduct(null);
                                setActiveAction(null);
                            }}
                        />
                    )}

                    {activeAction === "return" && (
                        <ReturnItemsList
                            product={selectedProduct}
                            onClose={() => {
                                setSelectedProduct(null);
                                setActiveAction(null);
                            }}
                        />
                    )}

                    {activeAction === "delete" && (
                        <DeleteProductForm
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