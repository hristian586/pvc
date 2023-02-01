import React  from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Main from './pages/main';
import Registration from './pages/registration';
import Purchases from './pages/purchases';
import Clients from './pages/clients';
import ClientPurch from './pages/clientPurch';
import ClientRegistration from './pages/clientRegistration';
import PurchasesRegistration from './pages/purchasesRegistration';
import PurchClient from './pages/purchClient';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' exact element ={<Login/>} />
        <Route path='main' element ={<Main/>} />
        <Route path='registration' element ={<Registration/>} />
        <Route path='purchases' element ={<Purchases/>} />
        <Route path='purchases/registration' element ={<PurchasesRegistration/>} />
        <Route path='purchases/:username' element ={<ClientPurch/>} />
        <Route path='clients' element ={<Clients/>} />
        <Route path='client/registration' element ={<ClientRegistration/>} />
        <Route path='clients/:buyer' element ={<PurchClient/>} />
      </Routes>
    </Router>
  );
}

export default App;  