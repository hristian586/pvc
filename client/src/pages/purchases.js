import React, { useEffect, useState} from "react";
import axios from "axios";
import "../admin.css";
import { useNavigate } from "react-router-dom";

function Purchases() {

    const [purchases, setPurchases] = useState([]);
    const [login, setLogin] = useState("");
    const [role, setRole] = useState("");

    const [editingPurchaseId, setEditingPurchaseId] = useState(null);
    const [updatedPurchase, setUpdatedPurchase] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    
    let navigate = useNavigate();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios
          .get("http://localhost:5000/purchases")
          .then((res) => setPurchases(res.data))
          .catch((err) => console.log(err));
        axios.get('http://localhost:5000/login').then((response) => {
            if (response.data.loggedIn === true) {
                setLogin(true);
            }
        })
        axios.get('http://localhost:5000/login').then((response) => {
                  if (response.data.loggedIn === true) {
                      setRole(response.data.user[0].role);
                      console.log(response.data);
                  }
              })
    }, []);

    const handleEdit = (purchaseId) => {
      setEditingPurchaseId(purchaseId);
    };

    const handleSave = (purchaseId) => {
        axios
            .put(`http://localhost:5000/purchases/${purchaseId}`, updatedPurchase)
            .then((res) => {
                setPurchases(
                    purchases.map((purchase) => {
                        if (purchase.id === purchaseId) {
                            return { ...purchase, ...updatedPurchase };
                        }
                        return purchase;
                    })
                );
                setEditingPurchaseId(null);
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedPurchase((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDelete = (purchaseId) => {
        axios
            .delete(`http://localhost:5000/purchases/${purchaseId}`)
            .then((res) => {
                setPurchases(purchases.filter(purchase => purchase.id !== purchaseId));
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        axios
            .get(`http://localhost:5000/purchases/search?term=${searchTerm}`)
            .then((res) => setPurchases(res.data))
            .catch((err) => console.log(err));
    }

    return (
        <div className="admin">
            { login && (
                <>
                    <form className="search-bar" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search by buyer or product name" 
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
                        {role === 'admin' && (
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
                            onClick={() => navigate("/purchases/registration")}
                        >
                            +
                        </button>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                            <th>Buyer</th>
                            <th>Product Name</th>
                            <th>Purchase Date</th>
                            <th>Quantity</th>
                            <th>Price For One Item</th>
                            <th>Price</th>
                            <th>Shipping Adress</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td className="underlined" onClick={() => {
                                        navigate(`/clients/${purchase.buyer}`);
                                        }}>{purchase.buyer}
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                            <input
                                                type="text"
                                                name="product"
                                                value={updatedPurchase.product || purchase.product}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            purchase.product
                                        )}
                                    </td>
                                    <td>
                                    
                                    {new Date(purchase.purchase_date).toLocaleDateString()}
                                    
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                            <select
                                                name="quantity"
                                                value={updatedPurchase.quantity || purchase.quantity}
                                                onChange={handleChange}
                                            >
                                                {Array.from({ length: 50 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            purchase.quantity
                                        )}
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                        <input
                                        type="text"
                                        name="priceForOne"
                                        value={updatedPurchase.priceForOne || purchase.priceForOne}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            purchase.priceForOne
                                        )}
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                        <input
                                        type="text"
                                        name="price"
                                        value={updatedPurchase.price || purchase.price}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            purchase.price
                                        )}
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                        <input
                                        type="text"
                                        name="adress"
                                        value={updatedPurchase.adress || purchase.adress}
                                        onChange={handleChange}
                                    />
                                        ) : (
                                            purchase.adress
                                        )}
                                    </td>
                                    <td>
                                        {editingPurchaseId === purchase.id ? (
                                            <>
                                                <button onClick={() => handleSave(purchase.id)}>Save</button>
                                                <button onClick={() => setEditingPurchaseId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(purchase.id)}>Edit</button>
                                                <button onClick={() => handleDelete(purchase.id)}>Delete</button>
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

export default Purchases;