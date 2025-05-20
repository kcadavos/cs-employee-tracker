'use client'

import { createContext, useContext, useEffect, useState } from "react";

interface AppContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (bool: boolean) => void;
    employeeId: number;
    setEmployeeId: (id: number) => void;
}

const AppContext = createContext<AppContext>({
    isLoggedIn: false,
    setIsLoggedIn: (bool: boolean) => '',
    employeeId: 0,
    setEmployeeId: (id: number) => {}
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [employeeId, setEmployeeId] = useState(0);

    useEffect(() => {
        const checkLogin = () => {
            let loggedIn = false;

            if(localStorage.getItem('user')) loggedIn = true;
            if(sessionStorage.getItem('user')) loggedIn = true;
        
            setIsLoggedIn(loggedIn);
        }

        checkLogin();
    }, [])

    return (
        <AppContext.Provider value={ { isLoggedIn, setIsLoggedIn, employeeId, setEmployeeId } } >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);