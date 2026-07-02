import api from "../../../lib/api.ts";



export const updateStaff = async (payload: { staff_id: number; name: string; email: string; }) => {
    const response = await api.patch(`/staff/${payload.staff_id}`, payload);
    return response.data;
};

export const removeStaff = async (staffId: number) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
};

export const updateStaffRole = async (payload: { staff_id: number; is_admin: boolean; }) => {
    const response = await api.patch(`/staff/${payload.staff_id}/role`, payload);
    return response.data;
};

export const getAllStaff = async () => {
    const response = await api.get("/staff");
    return response.data;
};