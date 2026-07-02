import { useState } from "react";
import type { AuditLog, Product } from "../../../auth/types";
import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";
import { deleteAuditLogs } from "../../services/productService";

interface DeleteAuditLogRangeProps {
    product: Product;
    /** Already-fetched logs for this product; filtered client-side by date. */
    logs: AuditLog[];
    onCancel: () => void;
    /** Lets the parent remove the deleted entries from its own state. */
    onDeleted: (deletedIds: number[]) => void;
}

// `end` is treated as inclusive through the end of that calendar day.
const isWithinRange = (dateStr: string, start: string, end: string) => {
    const time = new Date(dateStr).getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(`${end}T23:59:59.999`).getTime();
    return time >= startTime && time <= endTime;
};

export default function DeleteAuditLogRange({
    product,
    logs,
    onCancel,
    onDeleted,
}: DeleteAuditLogRangeProps) {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const hasRange = Boolean(startDate && endDate);
    const logsInRange = hasRange
        ? logs.filter((log) => isWithinRange(log.date, startDate, endDate))
        : [];

    const handleConfirmDelete = async () => {
        try {
            const idsToDelete = logsInRange.map((log) => log.id);

            const response = await deleteAuditLogs({
                product_id: product.id,
                start_date: startDate,
                end_date: endDate,
            });

            console.log("Audit logs deleted:", response);

            setIsPopupOpen(false);
            onDeleted(idsToDelete);

            alert("Audit log entries deleted.");
        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.detail ??
                "Failed to delete audit log entries."
            );
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-red-700">
                            Delete Audit Log Entries
                        </h3>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to log
                        </button>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Pick a date range below. Every entry logged in that range for{" "}
                        <strong>{product.name}</strong> will be permanently deleted.
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <label className="flex-1">
                            <span className="mb-1 block text-sm font-medium text-gray-700">
                                Start Date
                            </span>
                            <input
                                type="date"
                                value={startDate}
                                max={endDate || undefined}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </label>

                        <label className="flex-1">
                            <span className="mb-1 block text-sm font-medium text-gray-700">
                                End Date
                            </span>
                            <input
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </label>
                    </div>

                    {!hasRange ? (
                        <p className="text-center text-sm text-gray-500">
                            Select a start and end date to preview what will be deleted.
                        </p>
                    ) : (
                        <>
                            <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Date</th>
                                            <th className="px-3 py-2 text-center">Recipient</th>
                                            <th className="px-3 py-2 text-center">Handler</th>
                                            <th className="px-3 py-2 text-center">Quantity</th>
                                            <th className="px-3 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {logsInRange.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                                    No entries in this range.
                                                </td>
                                            </tr>
                                        ) : (
                                            logsInRange.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="px-3 py-2">{log.date}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        {log.recipient ?? "—"}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {log.user.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {log.quantity}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {log.action}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                type="button"
                                disabled={logsInRange.length === 0}
                                onClick={() => setIsPopupOpen(true)}
                                className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {logsInRange.length === 0
                                    ? "No entries to delete"
                                    : `Delete ${logsInRange.length} ${logsInRange.length === 1 ? "Entry" : "Entries"}`}
                            </button>
                        </>
                    )}
                </div>
            </Card>

            {isPopupOpen && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    borderColorClass="border-red-500"
                    confirmationLogic={handleConfirmDelete}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">Confirm Deletion</h3>

                            <p>
                                Delete <strong>{logsInRange.length}</strong>{" "}
                                {logsInRange.length === 1 ? "entry" : "entries"} for{" "}
                                <strong>{product.name}</strong> between{" "}
                                <strong>{startDate}</strong> and <strong>{endDate}</strong>?
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                This can&apos;t be undone.
                            </p>
                        </div>
                    }
                />
            )}
        </>
    );
}