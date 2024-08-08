// InvoiceList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebaseConfig';

const InvoiceList = () => {
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
      <h2>Invoices</h2>
      <ul>
      {error && <p className="error">{error}</p>}
        {invoices.map((invoice, index) => (
          <li key={index}>
            <p>Invoice Number: {invoice.invoiceNumber}</p>
            <p>Customer: {invoice.customerName}</p>
            <p>Total Cost: {invoice.totalCost}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
