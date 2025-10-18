import { BASE_URL, getJSON, postJSON } from ".";

const TypingResultAPI = {
    startTest(wordCount, token) {
        return postJSON(`${BASE_URL}/api/start-test?wordCount=${wordCount}`, {
            token: token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : undefined
            }
        });
    },

    generateTestToken({ sentence }, token) {
        return postJSON(`${BASE_URL}/api/generate-test-token`, {
            body: { sentence },
            token: token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    saveResult(result, token) {
        if (token) {
            return postJSON(`${BASE_URL}/api/results`, {
                body: result,
                token: token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Test-Token": result.testToken
                }
            });
        } else {
            return this.saveGuestResult(result);
        }
    },

    saveGuestResult(result) {
        console.log(result);
        return postJSON(`${BASE_URL}/api/guest-results`, {
            body: result,
            headers: {
                "Content-Type": "application/json"
            }
        });
    },

    getResults(id) {
        return getJSON(`${BASE_URL}/api/results/${id}`);
    },

    getRun(id) {
        return getJSON(`${BASE_URL}/api/run/${id}`);
    },

    getAllResults() {
        return getJSON(`${BASE_URL}/api/results`);
    }
};

export default TypingResultAPI;