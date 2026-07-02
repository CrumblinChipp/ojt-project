import { useState } from 'react';
import type { User } from "../../../auth/types";
import { useAuth } from "../../../../hooks/useAuth";
import ActionCard from "../../components/actionCard";
import Popup from "../../components/Popup";
import ViewStaffDetails from "./ViewStaffDetail";
import EditStaffForm from "./EditStaffForm";
import { removeStaff, updateStaffRole } from "../../services/staffService";

interface StaffTableProps {
    staff: User[];
    onStaffChange?: () => void;
}

type ActionType = 'view' | 'edit' | 'remove';

const ACTION_BORDER_COLORS: Record<ActionType, string> = {
    view: 'border-blue-500',
    edit: 'border-yellow-500',
    remove: 'border-red-500',
};

export default function StaffTable({
    staff,
    onStaffChange,
}: StaffTableProps) {

    const [search, setSearch] = useState("");
    const { user: currentUser } = useAuth();

    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
    const [activeAction, setActiveAction] = useState<ActionType | null>(null);


    const [roleChangeTarget, setRoleChangeTarget] = useState<User | null>(null);

    const closeAction = () => {
        setSelectedStaff(null);
        setActiveAction(null);
    };

    const handleRemoveConfirm = async () => {
        if (!selectedStaff) return;

        try {
            await removeStaff(selectedStaff.id);
            onStaffChange?.();
            closeAction();
            alert("Staff member removed.");
        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.detail ??
                "Failed to remove staff member."
            );
        }
    };

    const handleRoleConfirm = async () => {
        if (!roleChangeTarget) return;

        try {
            await updateStaffRole({
                staff_id: roleChangeTarget.id,
                is_admin: !roleChangeTarget.is_admin,
            });
            onStaffChange?.();
            setRoleChangeTarget(null);
            alert("Role updated.");
        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.detail ??
                "Failed to update role."
            );
        }
    };

    const filteredStaff = staff.filter((member) => {
        const query = search.toLowerCase().trim();

        return (
            member.name.toLowerCase().includes(query) ||
            member.email.toLowerCase().includes(query) ||
            member.organization.toLowerCase().includes(query)
        );
    });

    return (
        <>
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search by name, email, or organization..."
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
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-center">Organization</th>
                            <th className="px-4 py-3 text-center">Role</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    No staff found.
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((member) => {
                                const isSelf = currentUser?.id === member.id;
                                const canManage = !!currentUser?.is_admin;

                                return (
                                    <tr key={member.id}>
                                        <td className="px-4 py-3">{member.name}</td>
                                        <td className="px-4 py-3">{member.email}</td>
                                        <td className="px-4 py-3">{member.organization}</td>


                                        <td className="px-4 py-3 text-center">
                                            {canManage ? (
                                                <button
                                                    role="switch"
                                                    aria-checked={member.is_admin}
                                                    title={
                                                        member.is_admin
                                                            ? "Admin — click to revoke"
                                                            : "Staff — click to make admin"
                                                    }
                                                    onClick={() => setRoleChangeTarget(member)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        member.is_admin ? "bg-emerald-500" : "bg-gray-300"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            member.is_admin ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            ) : (
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        member.is_admin
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {member.is_admin ? "Admin" : "Staff"}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <button
                                                title="View"
                                                className="rounded bg-blue-500 px-3 py-1 mx-1 text-white hover:bg-blue-600"
                                                onClick={() => {
                                                    setSelectedStaff(member);
                                                    setActiveAction("view");
                                                }}
                                            >
                                                V
                                            </button>

                                            {isSelf && (
                                                <button
                                                    title="Edit"
                                                    className="rounded bg-yellow-500 px-3 py-1 mx-1 text-white hover:bg-yellow-600"
                                                    onClick={() => {
                                                        setSelectedStaff(member);
                                                        setActiveAction("edit");
                                                    }}
                                                >
                                                    E
                                                </button>
                                            )}

                                            {canManage && (
                                                <button
                                                    title="Remove"
                                                    className="rounded bg-red-500 px-3 py-1 mx-1 text-white hover:bg-red-600"
                                                    onClick={() => {
                                                        setSelectedStaff(member);
                                                        setActiveAction("remove");
                                                    }}
                                                >
                                                    R
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {selectedStaff && activeAction && activeAction !== "remove" && (
                <ActionCard
                    onClose={closeAction}
                    borderColorClass={ACTION_BORDER_COLORS[activeAction]}
                >
                    {activeAction === "view" && (
                        <ViewStaffDetails
                            staff={selectedStaff}
                            onClose={closeAction}
                        />
                    )}

                    {activeAction === "edit" && (
                        <EditStaffForm
                            staff={selectedStaff}
                            onClose={closeAction}
                            onStaffChange={onStaffChange}
                        />
                    )}
                </ActionCard>
            )}

            {selectedStaff && activeAction === "remove" && (
                <Popup
                    onClose={closeAction}
                    borderColorClass="border-red-500"
                    confirmationLogic={handleRemoveConfirm}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">
                                Remove this staff member?
                            </h3>
                            <p>
                                <strong>{selectedStaff.name}</strong> ({selectedStaff.email}){" "}
                                will lose access. This can&apos;t be undone.
                            </p>
                        </div>
                    }
                />
            )}

            {roleChangeTarget && (
                <Popup
                    onClose={() => setRoleChangeTarget(null)}
                    borderColorClass="border-emerald-500"
                    confirmationLogic={handleRoleConfirm}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">
                                {roleChangeTarget.is_admin
                                    ? "Revoke admin access?"
                                    : "Grant admin access?"}
                            </h3>
                            <p>
                                <strong>{roleChangeTarget.name}</strong> will{" "}
                                {roleChangeTarget.is_admin ? "no longer" : "now"} have admin
                                privileges.
                            </p>
                        </div>
                    }
                />
            )}
        </>
    );
}