import { BASE_URL } from '@env';

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
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
    return res;
};