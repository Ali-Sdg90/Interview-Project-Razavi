import axios from "axios";
import { API_BASE_URL } from "../constants/apiConstants";

// Display error messages as toast notifications with delay
const displayErrorMessages = (messages, setToastifyObj) => {
    console.log("in here", messages);

    if (Array.isArray(messages.Id)) {
        messages.Id.forEach((message, index) => {
            setTimeout(() => {
                setToastifyObj({
                    title: message,
                    mode: "error",
                });
            }, 150 * index);
        });
    } else {
        setToastifyObj({
            title: messages,
            mode: "error",
        });
    }
};

// Handle errors and trigger toast notifications
const handleError = (error, setToastifyObj) => {
    let errorMessage = "An unknown error occurred";

    if (error.response) {
        console.error("Error response:", error.response.data.errors);
        errorMessage = error.response.data.errors || errorMessage;
    } else if (error.request) {
        console.error("Error request:", error.request);
        errorMessage = "No response received from server";
    } else {
        console.error("Error message:", error.message);
        errorMessage = error.message;
    }

    if (setToastifyObj) {
        displayErrorMessages(errorMessage, setToastifyObj);
    }

    return Promise.reject(error);
};

// Create headers for API requests
const createHeaders = (needToken) => {
    const headers = {
        "Content-Type": "application/json",
    };

    // console.log("HEADER >>", needToken, ">>", headers);

    return headers;
};

// POST request
export const postRequest = async (
    endpoint,
    data,
    needToken = true,
    setToastifyObj
) => {
    // console.log("POST request >>", endpoint);

    try {
        const res = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: createHeaders(needToken),
        });

        return res.data;
    } catch (error) {
        return handleError(error, setToastifyObj);
    }
};

// GET request
export const getRequest = async (
    endpoint,
    needToken = true,
    setToastifyObj
) => {
    console.log("GET request >>", endpoint);

    try {
        const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: createHeaders(needToken),
        });

        return res.data;
    } catch (error) {
        return handleError(error, setToastifyObj);
    }
};

// PATCH request
export const patchRequest = async (
    endpoint,
    data,
    needToken = true,
    setToastifyObj
) => {
    // console.log("PATCH request >>", endpoint);

    try {
        const res = await axios.patch(`${API_BASE_URL}${endpoint}`, data, {
            headers: createHeaders(needToken),
        });

        return res.data;
    } catch (error) {
        return handleError(error, setToastifyObj);
    }
};

// DELETE request
export const deleteRequest = async (
    endpoint,
    needToken = true,
    setToastifyObj
) => {
    console.log("DELETE request >>", endpoint);

    try {
        const res = await axios.delete(`${API_BASE_URL}${endpoint}`, {
            headers: createHeaders(needToken),
        });

        return res.data;
    } catch (error) {
        return handleError(error, setToastifyObj);
    }
};
