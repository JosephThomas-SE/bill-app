// InvoiceForm.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
    const [formData, setFormData] = useState({
        ownerName: '',
        ownerAddress: '',
        customerName: '',
        customerAddress: '',
        ownerPhoneNumber: '',
        currentDate: '',
        checkInDate: '',
        checkOutDate: '',
        invoiceNumber: 0,
        accommodationDetails: {
          numberOfDays: 0,
          perDayCost: 0,
          numberOfRooms: 0,
          totalAccommodationCost: 0,
        },
        foodDetails: {
          numberOfPersons: 0,
          ratePerPerson: 0,
          numberOfTimesFoodProvided: 0,
          totalFoodCost: 0,
        },
        totalCost: 0,
        thankYouMessage: 'Thank you for staying with us! Please visit again.',
        ownerSignature: '/assets/signature.png',
        ownerSeal: '/assets/seal.png',
      });

  

  useEffect(() => {
    // Fetch the last invoice number and increment it
    const fetchInvoiceNumber = async () => {
        try {
          const invoicesCollection = collection(db, "invoices");
          const q = query(invoicesCollection, orderBy("invoiceNumber", "desc"), limit(1));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            const lastInvoice = querySnapshot.docs[0].data();
            setFormData(prevData => ({
              ...prevData,
              invoiceNumber: lastInvoice.invoiceNumber + 1
            }));
          } else {
            setFormData(prevData => ({
              ...prevData,
              invoiceNumber: 1
            }));
          }
        } catch (error) {
          console.error('Error fetching invoice number: ', error);
          // Optionally set an error state here
        }
      };
  
      fetchInvoiceNumber();
  }, []);


  const navigate = useNavigate();  // Initialize useNavigate

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle nested fields like accommodationDetails and foodDetails
  const handleNestedChange = (e, field, subField) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [subField]: value,
      },
    }));
  };

  // Move useEffect to the top level
  useEffect(() => {
    const { numberOfDays, perDayCost, numberOfRooms } = formData.accommodationDetails;
    const { numberOfPersons, ratePerPerson, numberOfTimesFoodProvided } = formData.foodDetails;

    const totalAccommodationCost = numberOfDays * perDayCost * numberOfRooms;
    const totalFoodCost = numberOfPersons * ratePerPerson * numberOfTimesFoodProvided;
    const totalCost = totalAccommodationCost + totalFoodCost;

    // Set the total cost in formData
    setFormData(prevData => ({
      ...prevData,
      accommodationDetails: {
        ...prevData.accommodationDetails,
        totalAccommodationCost,
      },
      foodDetails: {
        ...prevData.foodDetails,
        totalFoodCost,
      },
      totalCost,
    }));
    console.log(setFormData);
    console.log(formData);
  }, [formData.accommodationDetails, formData.foodDetails, formData]);


  //Hadle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Call the function to save the invoice
    await saveInvoiceToFirestore();
  };

    // Save the invoice to Firestore
    const saveInvoiceToFirestore = async () => {
  try {
    const invoiceDocRef = doc(db, 'invoices', formData.invoiceNumber.toString());

    await setDoc(invoiceDocRef, formData);

    console.log('Invoice saved successfully!');
    // Optionally, you can reset the form here
    setFormData({
      ownerName: '',
      ownerAddress: '',
      customerName: '',
      customerAddress: '',
      ownerPhoneNumber: '',
      currentDate: '',
      checkInDate: '',
      checkOutDate: '',
      invoiceNumber: formData.invoiceNumber + 1,
      accommodationDetails: {
        numberOfDays: 0,
        perDayCost: 0,
        numberOfRooms: 0,
        totalAccommodationCost: 0,
      },
      foodDetails: {
        numberOfPersons: 0,
        ratePerPerson: 0,
        numberOfTimesFoodProvided: 0,
        totalFoodCost: 0,
      },
      totalCost: 0,
      thankYouMessage: 'Thank you for staying with us! Please visit again.',
      ownerSignature: '/assets/signature.png',
      ownerSeal: '/assets/seal.png',
    });

    // Redirect to the invoice list page
    navigate('/invoice-list');

  } catch (error) {
    console.error('Error saving invoice: ', error);
  }
};



  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <h2>Create Invoice</h2>

      <div className="form-row">
        <div>
          <label>Owner Name:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Owner Address:</label>
          <input
            type="text"
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Customer Address:</label>
          <input
            type="text"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Owner Phone Number:</label>
          <input
            type="text"
            name="ownerPhoneNumber"
            value={formData.ownerPhoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Current Date:</label>
          <input
            type="date"
            name="currentDate"
            value={formData.currentDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Check-In Date:</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Check-Out Date:</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label>Invoice Number:</label>
        <input
          type="number"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
        />
      </div>

      <div className="group">
        <h3>Accommodation Details</h3>
        <div className="form-row">
          <div className="form-column">
            <div>
              <label>Number of Days:</label>
              <input
                type="number"
                name="numberOfDays"
                value={formData.accommodationDetails.numberOfDays}
                onChange={(e) => handleNestedChange(e, 'accommodationDetails', 'numberOfDays')}
              />
            </div>
            <div>
              <label>Per Day Cost:</label>
              <input
                type="number"
                name="perDayCost"
                value={formData.accommodationDetails.perDayCost}
                onChange={(e) => handleNestedChange(e, 'accommodationDetails', 'perDayCost')}
              />
            </div>
            <div>
              <label>Number of Rooms:</label>
              <input
                type="number"
                name="numberOfRooms"
                value={formData.accommodationDetails.numberOfRooms}
                onChange={(e) => handleNestedChange(e, 'accommodationDetails', 'numberOfRooms')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="group">
        <h3>Food Details</h3>
        <div>

        </div>
        <div className="form-row">
          <div className="form-column">
            <div>
              <label>Number of Persons:</label>
              <input
                type="number"
                name="numberOfPersons"
                value={formData.foodDetails.numberOfPersons}
                onChange={(e) => handleNestedChange(e, 'foodDetails', 'numberOfPersons')}
              />
            </div>
            <div>
              <label>Rate Per Person:</label>
              <input
                type="number"
                name="ratePerPerson"
                value={formData.foodDetails.ratePerPerson}
                onChange={(e) => handleNestedChange(e, 'foodDetails', 'ratePerPerson')}
              />
            </div>
            <div>
              <label>Number of Times Food Provided:</label>
              <input
                type="number"
                name="numberOfTimesFoodProvided"
                value={formData.foodDetails.numberOfTimesFoodProvided}
                onChange={(e) => handleNestedChange(e, 'foodDetails', 'numberOfTimesFoodProvided')}
              />
            </div>
          </div>
        </div>
      </div>

      <button type="submit">Save Invoice</button>
    </form>
  );
};

export default Form;
