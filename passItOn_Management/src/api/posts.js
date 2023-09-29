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