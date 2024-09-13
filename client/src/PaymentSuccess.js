import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css'; 
import axios from 'axios';
import jsPDF from 'jspdf';
import { baseURL } from './baseurl';

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const referenceNum = searchParams.get('reference');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/${referenceNum}`);
        const data = response.data; 
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch order details');
      }
    };

    if (referenceNum) {
      fetchOrderDetails();
    }
  }, [referenceNum]);

  const downloadPDF = () => {
    if (order) {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text('Booking Successful', 14, 22);
      doc.text(`Reference No.: ${order.razorpay_payment_id}`, 14, 32);
      doc.text(`Name: ${order.userInfo.name}`, 14, 42);
      doc.text(`Contact: ${order.userInfo.contact}`, 14, 52);
      doc.text(`Email: ${order.userInfo.email}`, 14, 62);
      doc.text('Services Booked:', 14, 72);

      order.services.forEach((service, index) => {
        doc.text(`${service.name} - ₹${service.price}`, 14, 82 + index * 10);
      });

      doc.text(`Total Amount: ₹${order.amount}`, 14, 82 + order.services.length * 10 + 10);

      doc.save('order-details.pdf');
    }
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        <h1 className="payment-success-heading">Booking Successful</h1>
        {error && <p className="error-message">{error}</p>}
        {order ? (
          <div className="order-details">
            <p><strong>Reference No.:</strong> {order.razorpay_payment_id}</p>
            <p><strong>Name:</strong> {order.userInfo.name}</p>
            <p><strong>Contact:</strong> {order.userInfo.contact}</p>
            <p><strong>Email:</strong> {order.userInfo.email}</p>
            <h2>Services Booked:</h2>
            <ul>
              {order.services.map(service => (
                <li key={service.id}>
                  {service.name} - ₹{service.price}
                </li>
              ))}
            </ul>
            <p><strong>Total Amount:</strong> ₹{order.amount}</p>
            <button className="my-order-button" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
