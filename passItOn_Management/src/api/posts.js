const baseUrl = import.meta.env.VITE_BASE_URL;


export const getPostsStatistics = async (searchQuery = {}) => {
    const params = new URLSearchParams(searchQuery);

    const response = await fetch(`${baseUrl}/api/posts/statistics?${params.toString()}`, {
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
        if (response.status == 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - POSTS:", res); // Print out the raw data
    return res;

};


export const amountOfPosts = async () => {

    const response = await fetch(`${baseUrl}/api/posts/count?`, {
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
        throw { ...res, status: response.status };
    }

    console.log("Raw data from API - POSTS:", res); // Print out the raw data
    return res;

};


export const getPosts = async (query = {}) => {
    const params = new URLSearchParams(query);

    const response = await fetch(`${baseUrl}/api/posts/search?${params.toString()}`, {
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
        if (response.status == 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - POSTS:", res); // Print out the raw data
    return res;

}


export const editPost = async (postID, updatedData) => {
    const response = await fetch(`${baseUrl}/api/posts/edit/${postID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            updatedData: { ...updatedData },
            toRemove: null,
            toAdd: null,
        }),
        credentials: 'include',
    });


    const res = await response.json();

    if (!response.ok) {
        console.log("res error posts => " + res);
        if (response.status == 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - POSTS:", res); // Print out the raw data
    return res;
}