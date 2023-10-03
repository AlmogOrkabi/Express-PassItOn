const baseUrl = import.meta.env.VITE_BASE_URL;


export const getReports = async (queryParams = {}) => {

    const params = new URLSearchParams(queryParams);


    const response = await fetch(`${baseUrl}/api/reports/search?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const res = await response.json();

    if (!response.ok) {
        if (response.status == 404)
            return 404;
        else
            throw { ...res, status: response.status };
    }

    console.log("Raw data from API - REPORTS:", res); // Print out the raw data
    return res;
};