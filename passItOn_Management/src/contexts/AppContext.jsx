import { createContext, useState, useEffect } from 'react'
import * as API from '../api/index'

export const AppContext = createContext();


export default function AppContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null); // the user currently logged in 

    const [users, setUsers] = useState([]);

    const loadUsers = async (query = {}) => {
        try {
            const res = await API.getUsers(query).then((res) => {
                setUsers(res);
            })

        } catch (error) {
            console.log("get users error: " + error)
            throw error;
        }
    }



    const value = { loggedUser, setLoggedUser, loadUsers, users };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}