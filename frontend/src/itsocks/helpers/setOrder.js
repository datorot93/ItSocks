import { fetchWithoutToken } from "../../utils/api";


export const setOrder = async( order ) => {
    const resp = await fetchWithoutToken(
        `orders`,
        order,
        'POST',
    )
    const data = await resp.json();

    return data
}

export const setProductOrder = async( product_order ) => {
    console.log(product_order)
    const resp = await fetchWithoutToken(
        `product_orders`,
        product_order,
        'POST',
    )
    const data = await resp.json();

    return data
}

