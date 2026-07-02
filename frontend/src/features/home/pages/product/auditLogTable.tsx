import { useEffect, useState } from "react";
import type { AuditLog } from "../../../auth/types";
import Card from "../../../../components/ui/Card";
import type { Product } from "../../../auth/types";
import { getAuditLogs } from "../../services/productService";
import DeleteAuditLogRange from "./DeleteAuditLogRange";
import { useAuth } from "../../../../hooks/useAuth";



interface AuditLogTableProps {
    onClose: () => void;
    product: Product;
}

export default function AuditLogTable({
    product,
}: AuditLogTableProps) {

    const { user: currentUser } = useAuth();
    const [auditLog, setAuditLog] = useState<AuditLog[]>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    useEffect(() => {
        const fetchAuditLog = async () => {
            try {
                const data = await getAuditLogs(product.id);
                setAuditLog(data);
            } catch (err) {
                console.error("Failed to fetch audit logs:", err);
            }
        };

        if (product.id) {
            fetchAuditLog();
        }
    }, [product.id]);

    if (isDeleteMode) {
        return (
            <DeleteAuditLogRange
                product={product}
                logs={auditLog}
                onCancel={() => setIsDeleteMode(false)}
                onDeleted={(deletedIds) => {
                    setAuditLog((prev) =>
                        prev.filter((log) => !deletedIds.includes(log.id))
                    );
                    setIsDeleteMode(false);
                }}
            />
        );
    }

    return (
    <>
      <Card>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-700">
                        Audit Log
                    </h3>

                    {currentUser && currentUser.is_admin && (
                        <button
                            type="button"
                            onClick={() => setIsDeleteMode(true)}
                            className="rounded text-sm font-medium py-2 px-3 text-white bg-red-500 hover:bg-red-600"
                        >
                            Delete Logs...
                        </button>
                    )}
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-400 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-center">Recipient</th>
                            <th className="px-4 py-3 text-center">Handler</th>
                            <th className="px-4 py-3 text-center">Quantity</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {auditLog.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    No audit log entries found.
                                </td>
                            </tr>
                        ) : (
                            auditLog.map((log)  => (
                                <tr key={log.id}>
                                    <td className="px-4 py-3">
                                        {log.date}
                                    </td>

                                    <td className="px-4 py-3">
                                        {product.id}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {log.recipient}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {log.user.name}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {log.quantity}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {log.action}
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
      </Card>
    </>
    );
}