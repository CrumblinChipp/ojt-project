import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";
import { getActiveBorrowings, returnProduct } from "../../services/productService";
import type { Product } from "../../../auth/types";
import type { ActiveBorrowing } from "../../../auth/types";

interface ReturnItemsListProps {
    product: Product;
    onClose: () => void;
    onProductsChange?: () => void;
}

export default function ReturnItemsList({
    product,
    onProductsChange,
}: ReturnItemsListProps) {

    const { user } = useAuth();

    const [records, setRecords] = useState<ActiveBorrowing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRecord, setSelectedRecord] = useState<ActiveBorrowing | null>(null);
    const [returnQuantity, setReturnQuantity] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadPendingReturns = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getActiveBorrowings(product.id);
                if (isMounted) setRecords(data);
            } catch (err: any) {
                console.error(err);
                if (isMounted) {
                    setError(
                        err.response?.data?.detail ??
                        "Failed to load pending returns."
                    );
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadPendingReturns();

        return () => {
            isMounted = false;
        };
    }, [product.id]);

    const openReturnConfirm = (record: ActiveBorrowing) => {
        setSelectedRecord(record);
        setReturnQuantity(String(record.quantity));
    };

    const handleConfirmReturn = async () => {
        if (!selectedRecord) return;

        const qty = Number(returnQuantity);

        if (!qty || qty < 1 || qty > selectedRecord.quantity) {
            alert(`Enter a quantity between 1 and ${selectedRecord.quantity}.`);
            return;
        }

        try {
            const response = await returnProduct(selectedRecord.id);

            console.log("Item returned:", response);

            // Full return removes the record; partial return just lowers the
            // outstanding quantity so the rest can still be returned later.
            setRecords((prev) =>
                prev
                    .map((r) =>
                        r.id === selectedRecord.id
                            ? { ...r, quantity: r.quantity - qty }
                            : r
                    )
                    .filter((r) => r.quantity > 0)
            );

            setSelectedRecord(null);
            onProductsChange?.();

            alert("Item marked as returned!");
        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.detail ??
                "Failed to process the return."
            );
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <h3 className="mb-2 text-lg font-semibold text-orange-700">
                            Pending Returns
                        </h3>
                        <p><strong>Product:</strong> {product.name}</p>
                    </div>

                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading…</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : records.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No pending borrowed items for this product.
                        </p>
                    ) : (
                        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Recipient</th>
                                        <th className="px-3 py-2 text-center">Qty Out</th>
                                        <th className="px-3 py-2 text-left">Pulled Out</th>
                                        <th className="px-3 py-2 text-left">Due Date</th>
                                        <th className="px-3 py-2 text-left">Handle</th>
                                        <th className="px-3 py-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {records.map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-3 py-2">{record.recipient}</td>
                                            <td className="px-3 py-2 text-center">{record.quantity}</td>
                                            <td className="px-3 py-2">{record.borrow_date}</td>
                                            <td className="px-3 py-2">{record.due_date}</td>
                                            <td className="px-3 py-2">{record.user.name}</td>

                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    className="rounded bg-orange-500 px-3 py-1 text-white hover:bg-orange-600"
                                                    onClick={() => openReturnConfirm(record)}
                                                >
                                                    Return
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>

            {selectedRecord && (
                <Popup
                    onClose={() => setSelectedRecord(null)}
                    borderColorClass="border-orange-500"
                    confirmationLogic={handleConfirmReturn}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">Confirm Return</h3>

                            <p><strong>Product:</strong> {product.name}</p>
                            <p><strong>Recipient:</strong> {selectedRecord.recipient}</p>
                            <p><strong>Staff Handler:</strong> {user?.name}</p>

                            <label className="mt-3 block">
                                <span className="text-sm font-medium">
                                    Quantity being returned (out of {selectedRecord.quantity})
                                </span>
                                <input
                                    type="number"
                                    min={1}
                                    max={selectedRecord.quantity}
                                    value={returnQuantity}
                                    onChange={(e) => setReturnQuantity(e.target.value)}
                                    className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
                                />
                            </label>
                        </div>
                    }
                />
            )}
        </>
    );
}