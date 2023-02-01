import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "../admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});

    let navigate = useNavigate();

    useEffect(() => {
        Axios
            .get("http://localhost:5000/users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    }, []);

    const handleEdit = (userId) => {
        setEditingUserId(userId);
    };

    const handleSave = (userId) => {
        Axios
            .put(`http://localhost:5000/users/${userId}`, updatedUser)
            .then((res) => {
                setUsers(
                    users.map((user) => {
                        if (user.id === userId) {
                            return { ...user, ...updatedUser };
                        }
                        return user;
                    })
                );
                setEditingUserId(null);
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDelete = (userId) => {
        Axios
            .delete(`http://localhost:5000/users/${userId}`)
            .then((res) => {
                setUsers(users.filter(user => user.id !== userId));
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }
  
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        Axios
          .get(`http://localhost:5000/users/search?term=${searchTerm}`)
          .then((res) => setUsers(res.data))
          .catch((err) => console.log(err));
    }
  
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="admin">
            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    placeholder="Search by username or name" 
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit">Search</button>
            </form>
            <div className="button-cotainer">
                <button className="new2" onClick={() => {
                navigate("/purchases")
                }} >Purchases</button>
                <button className="new2" onClick={() => {
                navigate("/main")
                }} >Users</button>
                <button className="new2" onClick={() => {
                navigate("/clients")
                }} >Clients</button>
            </div>

            <button className="new" onClick={() => {
            navigate("/registration")
            }}>+</button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>telephone</th>
                        <th>position</th>
                        <th>role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                {editingUserId === user.id ? (
                                    <input type="text"
                                    name="username"
                                    value={updatedUser.username || user.username}
                                    onChange={handleChange}
                                />
                            ) : (
                                user.username
                            )}
                        </td>
                        <td>
                            {editingUserId === user.id ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedUser.name || user.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                user.name
                            )}
                        </td>
                        <td>
                            {editingUserId === user.id ? (
                                <input
                                    type="text"
                                    name="telephone"
                                    value={updatedUser.telephone || user.telephone}
                                    onChange={handleChange}
                                />
                            ) : (
                                user.telephone
                            )}
                        </td>
                        <td>
                            {editingUserId === user.id ? (
                                <input
                                    type="text"
                                    name="position"
                                    value={updatedUser.position || user.position}
                                    onChange={handleChange}
                                />
                            ) : (
                                user.position
                            )}
                        </td>
                        <td>
                            {editingUserId === user.id ? (
                              <select name="role" value={updatedUser.role || user.role} onChange={handleChange}>
                                <option value='admin'>admin</option>
                                <option value='user'>user</option>
                              </select>
                            ) : (
                                 user.role
                            )}
                        </td>
                        <td>
                            {editingUserId === user.id ? (
                                <>
                                    <button onClick={() => handleSave(user.id)}>Save</button>
                                    <button onClick={() => setEditingUserId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default Admin;
