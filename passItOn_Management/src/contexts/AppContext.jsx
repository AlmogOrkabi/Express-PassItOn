import { createContext, useState, useEffect } from 'react'
import * as API from '../api/index'

export const AppContext = createContext();




export default function AppContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null); // the user currently logged in 

    const [users, setUsers] = useState([]);


    const [reports, setReports] = useState([]);



    const value = { loggedUser, setLoggedUser, users, setUsers, reports, setReports, };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}