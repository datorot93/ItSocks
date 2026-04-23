import { fetchWithoutToken } from "../utils/api";


export const getReportsOrders = async() => {

    const resp = await fetchWithoutToken(
        `sells-reports/products_by_city?skip=0&limit=100`
    )
    const data = await resp.json();
    return data
}


export const getProductSum = async() => {

    const resp = await fetchWithoutToken(
        `sells-reports/products_sum?skip=0&limit=100`
    )
    const data = await resp.json();
    return data
}

export const getDetailedOrders = async (fromDate=null, toDate=null) => {
    let url = `sells-reports/detailed_orders?skip=0&limit=100`;
    
    // Add query parameters if dates are provided
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetchWithoutToken(url);
    const data = await response.json();
    return data;
};