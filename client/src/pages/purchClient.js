import React from "react";
import "../admin.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function PurchClient() {
    const { buyer }  = useParams("");
    const [clients, setClients] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        axios
        .get(`http://localhost:5000/clients/purchase?username=${buyer}`)
        .then((res) => setClients(res.data))
        .catch((err) => console.log(err));
    });
        
      
    return (
        <div>
            <button className="new3" onClick={ () => navigate("/purchases")}>Back3</button>
            <table className="data-table">
                <thead>
                    <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Second Name</th>
                    <th>Telephone</th>
                    <th>Addres</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td 
                            className="underlined" 
                            onClick={() => {
                            navigate(`/purchases/${client.username}`);
                            }}>{client.username}
                            </td>
                            <td>{client.first_name}</td>
                            <td>{client.last_name}</td>
                            <td>{client.telephone}</td>
                            <td>{client.adress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
  
export default PurchClient;