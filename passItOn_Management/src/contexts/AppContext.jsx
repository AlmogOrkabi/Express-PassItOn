import { createContext, useState, useEffect } from 'react'

export const AppContext = createContext();


export default function AppContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null); // the user currently logged in 


    const value = { loggedUser, setLoggedUser };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}