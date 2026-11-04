import api from "./api";

// Fetch financial summary
export const getFinancialSummary = async (filters = {}) => {
    const response = await api.get("/reports/summary", {
        params: filters
    });

    return response.data;
};

// Fetch payment history
export const getPaymentHistory = async (filters = {}) => {
    const response = await api.get("/reports/payments", {
        params: filters
    });

    return response.data;
};