import Card from "../../../../components/ui/Card";
import type { User } from "../../../auth/types";

interface ViewStaffDetailsProps {
    staff: User;
    onClose: () => void;
}

// Note: `onClose` is accepted (StaffTable passes it to every action component
// uniformly) but isn't used here — this is a read-only view, and ActionCard's
// own X button already handles dismissing it.
export default function ViewStaffDetails({
    staff,
}: ViewStaffDetailsProps) {
    return (
        <Card>
            <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-blue-700">
                        Staff Details
                    </h3>

                    <p><strong>Name:</strong> {staff.name}</p>
                    <p><strong>Email:</strong> {staff.email}</p>
                    <p>
                        <strong>Role:</strong>{" "}
                        {staff.is_admin ? "Admin" : "Staff"}
                    </p>
                </div>
            </div>
        </Card>
    );
}