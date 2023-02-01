import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin.css";
import { useNavigate } from "react-router-dom";

function Clients( ) {
    const [clients, setClients] = useState([]);
    const [login, setLogin] = useState("");
    const [role, setRole] = useState("");
    
    const [editingClientId, setEditingClientId] = useState(null);
    const [updatedClient, setUpdatedClient] = useState({});
    
    const [searchTerm, setSearchTerm] = useState("");
    
    let navigate = useNavigate();
    
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios
          .get("http://localhost:5000/clients")
          .then((res) => setClients(res.data))
          .catch((err) => console.log(err));
      
        axios
          .get("http://localhost:5000/login")
          .then((response) => {
            if (response.data.loggedIn === true) {
              setLogin(true);
              setRole(response.data.user[0].role);
            }
          })
          .catch((err) => console.log(err));
    }, []);
      
    const handleEdit = (clientId) => {
    setEditingClientId(clientId);
    };
    
    const handleSave = (clientId) => {
    axios
        .put(`http://localhost:5000/clients/${clientId}`, updatedClient)
        .then((res) => {
        setClients(
            clients.map((client) => {
            if (client.id === clientId) {
                return { ...client, ...updatedClient };
            }
            return client;
            })
        );
        setEditingClientId(null);
        })
        .catch((err) => console.log(err));
    };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedClient((prevState) => ({ ...prevState, [name]: value }));
    };
    
    const handleDelete = (clientId) => {
        axios
            .delete(`http://localhost:5000/clients/${clientId}`)
            .then((res) => {
            setClients(clients.filter((client) => client.id !== clientId));
            })
            .catch((err) => console.log(err));
    };
    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        axios
            .get(`http://localhost:5000/clients/search?term=${searchTerm}`)
            .then((res) => setClients(res.data))
            .catch((err) => console.log(err));
    };

    return(
        <div className="admin">
            { login && (
                <>
                    <form className="search-bar" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search by username" 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button type="submit">Search</button>
                    </form>

                    <div className="button-container">
                        <button
                            className="new2"
                            onClick={() => navigate("/purchases")}
                        >
                            Purchases
                        </button>
                        { role === 'admin' && (
                            <button
                            className="new2"
                            onClick={() => navigate("/main")}
                            >
                            Users
                            </button>
                        )}
                        <button
                            className="new2"
                            onClick={() => navigate("/clients")}
                        >
                            Clients
                        </button>
                        <button
                            className="new"
                            onClick={() => navigate("/client/registration")}
                        >
                            +
                        </button>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Second Name</th>
                                <th>Telephone</th>
                                <th>Addres</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="underlined" onClick={() => {
                                        navigate(`/purchases/${client.username}`);
                                        }}>{client.username}
                                    </td>
                                    <td>
                                        {editingClientId === client.id ? (
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={updatedClient.first_name || client.first_name}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            client.first_name
                                        )}
                                    </td>
                                    <td>
                                        {editingClientId === client.id ? (
                                        <input
                                        type="text"
                                        name="last_name"
                                        value={updatedClient.last_name || client.last_name}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            client.last_name
                                        )}
                                    </td>
                                    <td>
                                        {editingClientId === client.id ? (
                                        <input
                                        type="text"
                                        name="telephone"
                                        value={updatedClient.telephone || client.telephone}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            client.telephone
                                        )}
                                    </td>
                                    <td>
                                        {editingClientId === client.id ? (
                                        <input
                                        type="text"
                                        name="adress"
                                        value={updatedClient.adress || client.adress}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            client.adress
                                        )}
                                    </td>
                                    <td>
                                        {editingClientId === client.id ? (
                                            <>
                                                <button onClick={() => handleSave(client.id)}>Save</button>
                                                <button onClick={() => setEditingClientId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(client.id)}>Edit</button>
                                                <button onClick={() => handleDelete(client.id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </>
            )}
      </div>
    );
}

export default Clients;