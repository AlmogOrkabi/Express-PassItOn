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