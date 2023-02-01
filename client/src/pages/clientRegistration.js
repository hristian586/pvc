import React, { useState, useEffect } from "react";
import Axios from 'axios';
import '../App.css';

import { useNavigate } from "react-router-dom";


function ClientRegistration() {
    const [usernameReg, setUsernameReg] = useState(""); 
    const [passwordReg, setPasswordReg] = useState(""); 
    const [firstNameReg, setFirstNameReg] = useState(""); 
    const [lastNameReg, setLastNameReg] = useState(""); 
    const [telephoneReg, setTelephoneReg] = useState(""); 
    const [adressReg, setAdressReg] = useState(""); 
    
    const [registrationStatus, setRegistrationStatus] = useState(""); 

    let navigate = useNavigate();

    const [role, setRole] = useState("");
    Axios.defaults.withCredentials = true;
    useEffect(() => {
            Axios.get('http://localhost:5000/login').then((response) => {
                if (response.data.loggedIn === true) {
                    setRole(response.data.user[0].role);
                    console.log(response.data);
                }
            })
    }, []);

    
    const register = () => {
        Axios.post("http://localhost:5000/clientRegister", {
          username: usernameReg,
          password: passwordReg,
          first_name: firstNameReg,
          last_name: lastNameReg,
          telephone: telephoneReg,
          adress: adressReg ,
        }).then(response => {
          setRegistrationStatus(response.data);
          if (response.data === "Client registered successfully.") {
            navigate("/clients");
          }
        });
    };


    return (
        <div className="App">
          {role === "admin" || role === "user" ? (
            <div className="registration">
                <h1>Register a New Client</h1>
                <input
                    className="input_register"
                    type="text"
                    placeholder="Username..."
                    onChange={e => setUsernameReg(e.target.value)}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Password..."
                    onChange={e => setPasswordReg(e.target.value)}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="First Name..."
                    onChange={e => setFirstNameReg(e.target.value)}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Last Name..."
                    onChange={e => setLastNameReg(e.target.value)}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Telephone..."
                    onChange={e => setTelephoneReg(e.target.value)}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Address..."
                    onChange={e => setAdressReg(e.target.value)}
                />
                
                <button onClick={register}>Register</button>
                <button onClick={() => navigate("/clients")}>Cancel</button>
                <h3>{registrationStatus}</h3>
            </div>
          ) : null}
        </div>
    );
}


export default ClientRegistration;