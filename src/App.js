import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import InvoiceForm from './components/Form';
import InvoiceList from './components/List';
import InvoiceDetail from './components/Details';

import './App.css'; // You can add your custom styles here

const App = () => {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Invoice App</h1>
          <nav>
              <div><Link to="/">Home</Link></div>
              <div><Link to="/create-invoice">Create Invoice</Link></div>
              <div><Link to="/invoice-list">Invoice List</Link></div>
          </nav>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-invoice" element={<InvoiceForm />} />
            <Route path="/invoice-list" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// A simple home component
const Home = () => {
  return (
    <div>
      <h2>Welcome to the Invoice App</h2>
      <p>Select an option from the menu to get started.</p>
    </div>
  );
};

export default App;
