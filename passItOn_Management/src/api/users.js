// import { VITE_BASE_URL } from '@env';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const login = async (email, password) => {
    console.log("we got here")
    console.log(baseUrl)
    const response = await fetch(`${baseUrl}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            managementLogin: true,
        }),
        credentials: 'include', // *required for cookies to be sent (without this line the browser would not accept and save the coockie 🍪)
    });

    const res = await response.json();

    if (!response.ok) {
        //throw new Error(res.msg);
        //throw { ...res, status: response.status };
        throw { ...res, status: response.status };
    }
    //await setToken(res.token); -->> THIS LINE HERE
    console.log("Raw data from API:", res); // Print out the raw data
    return res.user;
};


export const getUsers = async (queryParams = {}) => {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(`${baseUrl}/api/users/search?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });

    const res = await response.json();

    if (!response.ok) {
        if (response.status === 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - USERS : ", res); // Print out the raw data
    return res;
};

export const getUsersStatistics = async (queryParams = {}) => {
    const params = new URLSearchParams(queryParams);

    const response = await fetch(`${baseUrl}/api/users/statistics?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });


    const res = await response.json();

    if (!response.ok) {
        if (response.status === 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - USERS  - statistics : ", res); // Print out the raw data
    return res;
}


export const userLogOut = async () => {
    const response = await fetch(`${baseUrl}/api/users/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const res = await response.json();

    if (!response.ok) {
        throw response.status;
    }

    console.log("logout results : ", res);
    return res;
};



export const amountOfUsers = async () => {

    const response = await fetch(`${baseUrl}/api/users/count?`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
    });

    const res = await response.json();

    if (!response.ok) {
        console.log("res error posts => " + res);
        throw response;
    }

    console.log("Raw data from API - USERS:", res); // Print out the raw data
    return res;

};


export const updateUserStatus = async (_id, status) => {
    console.log("id:", _id, " status: ", status);
    const response = await fetch(`${baseUrl}/api/users/${_id}/updateStatus`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            activationStatus: status
        }),
        credentials: 'include',
    });

    const res = await response.json();
    console.log("response: " + JSON.stringify(res));
    if (!response.ok) {
        console.log("res error users => " + res);
        throw response;
    }

    console.log("Raw data from API - USERS:", res); // Print out the raw data
    return res;

};


export const updateUserRole = async (_id, role) => {

    const response = await fetch(`${baseUrl}/api/users/${_id}/changeUserRole`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            role: role
        }),
        credentials: 'include',
    });

    const res = await response.json();

    if (!response.ok) {
        console.log("res error users => " + res);
        throw response;
    }

    console.log("Raw data from API - USERS:", res); // Print out the raw data
    return res;

};