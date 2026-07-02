import { useState } from "react";
import Input from "../../../../components/ui/Input";
import Card from "../../../../components/ui/Card";
import Popup from "../../components/Popup";
import { updateStaff } from "../../services/staffService";
import type { User } from "../../../auth/types";

interface EditStaffFormProps {
    staff: User;
    onClose: () => void;
    onStaffChange?: () => void;
}

export default function EditStaffForm({
    staff,
    onClose,
    onStaffChange,
}: EditStaffFormProps) {

    const [formData, setFormData] = useState({
        name: staff.name,
        email: staff.email,
        organization: staff.organization,
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                staff_id: staff.id,
                name: formData.name,
                email: formData.email,
                organization: formData.organization,
            };

            const response = await updateStaff(payload);

            console.log("Staff updated:", response);

            setIsPopupOpen(false);
            onStaffChange?.();
            onClose();

            alert("Profile Updated Successfully!");
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.detail ??
                "Failed to update profile."
            );
        }
    };

    return (
        <>
            <Card>
                <div className="flex flex-col gap-4">

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <h3 className="mb-2 text-lg font-semibold text-yellow-700">
                            Editing Your Profile
                        </h3>
                        <p className="text-sm text-gray-600">
                            Role is managed by an admin and can&apos;t be changed here.
                        </p>
                    </div>

                    <Input
                        name="name"
                        label="Name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Input
                        name="email"
                        label="Email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        name="organization"
                        label="Organization"
                        placeholder="Enter Organization"
                        value={formData.organization}
                        onChange={handleChange}
                    />

                    <button
                        className="mt-4 w-full rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
                        onClick={() => {
                            if (!formData.name || !formData.email || !formData.organization) {
                                alert("Please fill out all fields.");
                                return;
                            }

                            setIsPopupOpen(true);
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </Card>

            {isPopupOpen && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    borderColorClass="border-yellow-500"
                    confirmationLogic={handleSubmit}
                    message={
                        <div className="text-left text-gray-800">
                            <h3 className="mb-2 font-bold">Confirm Changes:</h3>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>ORganization:</strong> {formData.organization}</p>
                        </div>
                    }
                />
            )}
        </>
    );
}