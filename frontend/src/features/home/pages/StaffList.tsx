import { useEffect, useState } from "react";
import StaffTable from "./staff/StaffTable";
import { getAllStaff } from "../services/staffService";
import type { User } from "../../auth/types";

export default function ProductList() {
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await getAllStaff();
            setStaff(data);
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading staff...</p>
            ) : (
                <StaffTable
                    staff={staff}
                    onStaffChange={fetchStaff}
                />
            )}
        </div>
    );
}