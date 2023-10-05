import { createContext, useState, useEffect } from 'react'
import * as API from '../api/index'


export const AppContext = createContext();




export default function AppContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(null); // the user currently logged in 

    const [users, setUsers] = useState([]);


    const [reports, setReports] = useState([]);

    const [posts, setPosts] = useState([]);

    async function loadAppData() {
        try {
            // setloading(true);
            await fetchReports();
            await fetchUsers();
            await fetchPosts();
            // setloading(false);
        } catch (error) {
            console.log("error - AppData: " + error);
        }
    }


    async function fetchUsers() {
        try {
            const res = await API.getUsers({});
            setUsers(() => res);
        } catch (error) {
            throw error;
        }
    }

    async function fetchReports() {
        try {
            const reportslist = await API.getReports({ full: 'true' });
            setReports(() => reportslist);
        } catch (error) {
            throw error;
        }
    }

    async function fetchPosts() {
        try {
            const res = await API.getPosts({ full: 'true' });
            setPosts(() => res);
        } catch (error) {
            throw error;
        }
    }


    const value = { loggedUser, setLoggedUser, users, setUsers, reports, setReports, fetchUsers, posts, setPosts, fetchReports, fetchPosts, loadAppData };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}