function createFetchFunction(method) {
    return async (url, params) => {
        const _params = {
            method,
            headers: {
                "content-type": "application/json"
            },
            ...params
        };

        if (_params.token !== null) {
            _params.headers["Authorization"] = `Bearer ${_params.token}`;
        }

        if (_params.body !== null) {
            _params.body = JSON.stringify(_params.body);
        }

        console.log(url, _params)
        const response = await fetch(url, _params);

        if (!response.ok) {
            const error = new Error("Request failed with status " + response.status);
            error.response = response;
            throw error;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }
    };
}

export const getJSON = createFetchFunction("GET");
export const postJSON = createFetchFunction("POST");
export const putJSON = createFetchFunction("PUT");
export const deleteJSON = createFetchFunction("DELETE");
export const BASE_URL = "http://localhost:8080";
//export const BASE_URL = "https://campustype-backend.onrender.com";

