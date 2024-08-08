import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoiceForm from './components/invoiceForm';
import InvoiceList from './components/invoiceList';
import './App.css'; // You can add your custom styles here

const App = () => {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Invoice App</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/create-invoice">Create Invoice</a></li>
              <li><a href="/invoice-list">Invoice List</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-invoice" element={<InvoiceForm />} />
            <Route path="/invoice-list" element={<InvoiceList />} />
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
