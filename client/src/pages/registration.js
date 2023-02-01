import React, { useState, useEffect } from "react";
import Axios from 'axios';
import '../App.css';
import { useNavigate } from "react-router-dom";


function Registration() {
    const [usernameReg, setUsernameReg] = useState(""); 
    const [passwordReg, setPasswordReg] = useState(""); 
    const [nameReg, setNameReg] = useState(""); 
    const [telephoneReg, setTelephoneReg] = useState(""); 
    const [positionReg, setPositionReg] = useState(""); 
    const [roleReg, setRoleReg] = useState(""); 
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
        Axios.post("http://localhost:5000/register", {
          username: usernameReg,
          password: passwordReg,
          name: nameReg,
          telephone: telephoneReg,
          position: positionReg,
          role: roleReg
        }).then(response => {
          setRegistrationStatus(response.data);
          if (response.data === "User registered successfully.") {
            navigate("/main");
          }
        });
    };


    return (
        <div className="App">
            {role === "admin" && (
                <div className="registration">
                <h1>Register a New User</h1>
                <input
                    className="input_register"
                    type="text"
                    placeholder="Username..."
                    onChange={(e) => {
                    setUsernameReg(e.target.value);
                    }}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Password..."
                    onChange={(e) => {
                    setPasswordReg(e.target.value);
                    }}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Name(First and Second)..."
                    onChange={(e) => {
                    setNameReg(e.target.value);
                    }}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Telephone..."
                    onChange={(e) => {
                    setTelephoneReg(e.target.value);
                    }}
                />
                <input
                    className="input_register"
                    type="text"
                    placeholder="Position..."
                    onChange={(e) => {
                    setPositionReg(e.target.value);
                    }}
                />
                <select
                    className="select"
                    onChange={(e) => {
                    setRoleReg(e.target.value);
                    }}
                >
                    <option value="" disabled selected>
                    Role...
                    </option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                
                <button onClick={register}>Register</button>
                <button onClick={() => navigate("/")}>Cancel</button>
                
                <h3>{registrationStatus}</h3>
                
                </div>
            )}
        </div>
    );

}


export default Registration;