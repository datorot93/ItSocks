import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ItSocksContext } from '../itsocks/context/ItSocksContext';


import { ItSocksRoutes } from '../itsocks/routes/ItSocksRoutes';
import { PublicRoutes } from './PublicRoutes';



export const AppRouter = () => {
    
    
    return (
        <>
            <Routes>
                <Route path="*" element={
                    <PublicRoutes>
                        <ItSocksRoutes />
                    </PublicRoutes>
                }
                />
            </Routes>
        </>
    )
}
