import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Details.css';


const Details = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const invoiceRef = doc(db, 'invoices', id);
      const invoiceSnap = await getDoc(invoiceRef);
      if (invoiceSnap.exists()) {
        setInvoice(invoiceSnap.data());
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    const input = document.getElementById('invoice');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
      });
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <div id="invoice" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <h2>Invoice Number: {invoice.invoiceNumber}</h2>
        <div className="customer-info">
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Customer Address:</strong> {invoice.customerAddress}</p>
        </div>
        <div className="cost-info">
          <p><strong>Total Cost:</strong> {invoice.totalCost}</p>
        </div>
        <div className="date-info">
          <p><strong>Check-In Date:</strong> {invoice.checkInDate}</p>
          <p><strong>Check-Out Date:</strong> {invoice.checkOutDate}</p>
        </div>
        <div className="signature-seal">
          <div className="signature">
            <img src={invoice.ownerSignature} alt="Owner Signature" />
            <p>Signature</p>
          </div>
          <div className="seal">
            <img src={invoice.ownerSeal} alt="Owner Seal" />
            <p>Seal</p>
          </div>
        </div>
      </div>
      <button onClick={handlePrint} style={{ marginTop: '20px', marginRight: '10px' }}>Print Invoice</button>
      <button onClick={generatePDF} style={{ marginTop: '20px' }}>Download PDF</button>
    </div>
  );
};

export default Details;
