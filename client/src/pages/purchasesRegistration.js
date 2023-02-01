import React, { useState, useEffect, useMemo } from "react";
import Axios from 'axios';
import '../App.css';
import { useNavigate } from "react-router-dom";


function PurchasesRegistration() {
  const [buyer, setBuyer] = useState(""); 
  const [product, setProduct] = useState("");  
  const [quantity, setQuantity] = useState(1); 
  const [priceForOne, setPriceForOne] = useState(0); 
  const price = useMemo(() => quantity * priceForOne, [quantity, priceForOne]); 
  const [adress, setAdress] = useState(""); 
  const [registrationStatus, setRegistrationStatus] = useState(""); 
  const today = new Date().toISOString().substr(0, 10);

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
      Axios.post("http://localhost:5000/purchasesRegister", {
        buyer: buyer,
        product: product,
        purchase_date: today,
        quantity: quantity,
        priceForOne: priceForOne,
        price: price,
        adress: adress,
      }).then(response => {
        setRegistrationStatus(response.data);
        if (response.data === "Purchase registered successfully.") {
          navigate("/purchases");
        }
      });
  };

  return (
    <div className="App">
      {
        role === 'admin' || role === 'user' ? (
          <div className="registration">
            <h1>Register a New Purchase</h1>
            <input
              className="input_register"
              type="text"
              placeholder="Buyer..."
              onChange={e => setBuyer(e.target.value)}
            />
            <input
              className="input_register"
              type="text"
              placeholder="Product..."
              onChange={e => setProduct(e.target.value)}
            />
            <input
              className="input_register"
              type="text"
              value={today}
              readOnly
            />
            <select
              className="select"
              onChange={e => setQuantity(e.target.value)}
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <input
              className="input_register"
              type="text"
              placeholder="Price For One..."
              onChange={e => setPriceForOne(e.target.value)}
            />
            {
              priceForOne === 0 ? (
                <input
                  className="input_register"
                  type="text"
                  placeholder="Overall Price"
                  readOnly
                />
              ) : (
                <input
                  className="input_register"
                  type="text"
                  value={price}
                  readOnly
                />
              )
            }
            <input
              className="input_register"
              type="text"
              placeholder="Adress..."
              onChange={e => setAdress(e.target.value)}
            />
            <button onClick={register}>Register</button>
            <button onClick={() => navigate("/purchases")}>Cancel</button>
            <h3>{registrationStatus}</h3>
          </div>
        ) : null
      }
    </div>
  );
}


export default PurchasesRegistration;