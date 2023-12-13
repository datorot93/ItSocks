export const getDepartamentos = async( ) => {
        
        const resp = await fetchWithoutToken(`shippingsshippings_departamentos?skip=0&limit=400`)
        const data = await resp.json();

        
        return data
}