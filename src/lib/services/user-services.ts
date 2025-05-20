import { AuthInfo } from "../interfaces/interfaces";

const baseURL = 'https://employee-student-api.azurewebsites.net/User/'


const login = async (loginInfo: AuthInfo, rememberMe: boolean) => {
    const response = await fetch(`${baseURL}Login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...loginInfo }),
        cache: 'no-cache'
    });

    if (!response.ok) {
        const message = `An error has occurred ${response.status}`
        throw new Error(message);
    }
    const data = await response.json();

    if(rememberMe) {
        if(sessionStorage.getItem('user')) {
            sessionStorage.removeItem('user');
        }
        localStorage.setItem('user', JSON.stringify(data));
    } else {
        if(localStorage.getItem('user')) {
            localStorage.removeItem('user');
        }
        sessionStorage.setItem('user', JSON.stringify(data));
    }

    return data;
}

const createUser = async (user: AuthInfo) => {
    const response = await fetch(`${baseURL}CreateUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
        cache: 'no-cache'
    });

    if (!response.ok) {
        const message = `An error has occurred ${response.status}`
        throw new Error(message);
    }
    return await response.json();
}

export { login, createUser }