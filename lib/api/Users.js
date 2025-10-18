import {BASE_URL, deleteJSON, getJSON, postJSON, putJSON} from ".";

const UsersAPI=  {
    login(user) {
        return postJSON(`${BASE_URL}/api/auth/login`, {body: user})
    },
    register(user) {
        return postJSON(`${BASE_URL}/api/auth/register`, {body: user})
    },
    resendVerification(email) {
        return postJSON(`${BASE_URL}/api/auth/resend-verification`, {body: {email}})
    },
    checkVerification(email, password) {
        return postJSON(`${BASE_URL}/api/auth/check-verification`, {body: {email, password}})
    },
    update(user, token) {
        const id = user.id
        return putJSON(`${BASE_URL}/api/users/${id}`, {body: user, token: token})
    },
    getUser(id) {
        return getJSON(`${BASE_URL}/api/users/${id}`)
    },
    deleteUser(id) {
        return deleteJSON(`${BASE_URL}/api/users/${id}`)
    }
};

export default UsersAPI;