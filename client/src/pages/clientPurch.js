import React from "react";
import "../admin.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function ClientPurch() {
    const { username }  = useParams("");
    const [purchases, setPurchases] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios
        .get(`http://localhost:5000/purchases/client?buyer=${username}`)
        .then((res) => setPurchases(res.data))
        .catch((err) => console.log(err));
    });
        
      
    return (
        <div>
          <button className="new3" onClick={() => navigate("/clients")}>
            Back
          </button>
          <table className="data-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Product Name</th>
                <th>Purchase Date</th>
                <th>Price</th>
                <th>Shipping Address</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase.id}>
                  <td>{purchase.buyer}</td>
                  <td>{purchase.product}</td>
                  <td>{purchase.purchase_date}</td>
                  <td>{purchase.price}</td>
                  <td>{purchase.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
}
  
export default ClientPurch;
  