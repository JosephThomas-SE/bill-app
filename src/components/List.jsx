// InvoiceList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebaseConfig';
import './List.css';

const List = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  useEffect( () => {
    // Define an async function to fetch invoices
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const invoicesData = querySnapshot.docs.map(doc => doc.data());
        setInvoices(invoicesData);
      } catch (err) {
        setError('Failed to fetch invoices. Please try again later.');
        console.error('Error fetching invoices: ', err);
      }
    };

    fetchInvoices(); // Call the async function
  }, []); // Empty dependency array ensures this runs only once after the initial render

  return (
    <div>
      <div>
        <h1>Invoice List</h1>
      </div>
      <div className="invoice-list">
        {error && <p className="error">{error}</p>}
        {invoices.map((invoice) => (
          <div className="invoice-card" key={invoice.id}>
            <h3>Invoice Number: {invoice.invoiceNumber}</h3>
            <p><strong>Customer:</strong> {invoice.customerName}</p>
            <p><strong>Total Cost:</strong> {invoice.totalCost}</p>
            <Link to={`/invoices/${invoice.id}`} className="view-details">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
