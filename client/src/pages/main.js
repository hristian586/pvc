import Axios from "axios";
import React, { useEffect, useState } from "react";
import Clients from '../pages/clients';
import Admin from './users';

function Main() {

    const [role, setRole] = useState("");
    Axios.defaults.withCredentials = true;
    useEffect(() => {
            Axios
            .get('http://localhost:5000/login')
            .then((response) => {
                if (response.data.loggedIn === true) {
                    setRole(response.data.user[0].role);
                    console.log(response.data);
                }
            })
    }, []);

    return (
        <div>
            {role === 'admin' && <Admin />}
            {role === 'user' && <Clients />}
        </div>

    );
}


export default Main;