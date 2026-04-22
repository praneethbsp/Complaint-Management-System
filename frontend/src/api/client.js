const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

const fetchClient = async (endpoint, options = {}) => {
    // If body is FormData, don't stringify and don't set Content-Type header
    const isFormData = options.body instanceof FormData;

    const config = {
        ...options,
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
        credentials: 'include', // Important for cookies (JWT)
    };

    if (!isFormData && config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data?.message || data?.error || 'Something went wrong',
                data?.details
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, error.message || 'Network error');
    }
};

const apiClient = {
    get: (endpoint, options) => fetchClient(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchClient(endpoint, { ...options, method: 'POST', body }),
    patch: (endpoint, body, options) => fetchClient(endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint, options) => fetchClient(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
