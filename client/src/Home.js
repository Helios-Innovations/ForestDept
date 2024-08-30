import React, { useState } from "react";
import Navbar from "./Navbar";
import "./App.css";
import axios from 'axios';
import { Footer } from "./Footer";

const services = [
  { id: 1, name: "Adult", domesticPrice: 30, foreignPrice: 200 },
  { id: 2, name: "Children/Student", domesticPrice: 15, foreignPrice: 100 },
  { id: 3, name: "Educational Tour Group of 30 Nos & above", domesticPrice: 40, foreignPrice: 100 },
  { id: 4, name: "Persons for own Academy Study/Research", domesticPrice: 1000, foreignPrice: 5000 },
  { id: 5, name: "Occupation of Forest I.B", domesticPrice: 1000, foreignPrice: 5000 },
  { id: 6, name: "Use of still/digital camera", domesticPrice: 200, foreignPrice: 500 },
  { id: 7, name: "Video Camera", domesticPrice: 1000, foreignPrice: 250 },
  { id: 8, name: "Boating", domesticPrice: 50, foreignPrice: 250 },
  { id: 9, name: "Light vehicle (Up to 10 seat capacity)", domesticPrice: 100, foreignPrice: 500 },
];

function Home() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    contact: "",
    email: ""
  });

  const addService = (service, type) => {
    const serviceWithPrice = {
      ...service,
      type,
      price: type === "domestic" ? service.domesticPrice : service.foreignPrice
    };
    setSelectedServices([...selectedServices, serviceWithPrice]);
  };

  const removeService = (service, type) => {
    setSelectedServices(
      selectedServices.filter(
        (s) => !(s.id === service.id && s.type === type)
      )
    );
  };

  const amount = selectedServices.reduce((sum, service) => sum + service.price, 0);

  async function checkoutHandler() {
    try {
      const { data: { key } } = await axios.get("http://localhost:5000/api/getkey");

      const { data: { order } } = await axios.post("http://localhost:5000/api/v1/checkout", {
        amount,
        userInfo,
        services: selectedServices
      });

      const options = {
        key,
        amount: order.amount * 100,
        currency: "INR",
        name: "Forest",
        description: "Payment integration",
        image: "https://logo.com/image-cdn/images/kts928pd/production/396f6f3c7f506eb9674c2a6e244249faeda83b00-424x419.png?w=1080&q=72",
        order_id: order.id,
        callback_url: `http://localhost:5000/api/v1/paymentverification`,
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.contact
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "#121212"
        }
      };

      const razor = new window.Razorpay(options);
      razor.on('payment.success', function (response) {
        console.log('Payment successful', response);
      });

      razor.on('payment.error', function (response) {
        console.log('Payment failed', response.error.description);
      });

      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  return (
    <div className="App">
      <Navbar />
      <div className="table-container">
        <table className="service-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Classification</th>
              <th>Domestic Rate (₹)</th>
              <th>Add (Domestic)</th>
              <th>Foreign Rate (₹)</th>
              <th>Add (Foreign)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id}>
                <td>{index + 1}</td>
                <td>{service.name}</td>
                <td>₹{service.domesticPrice}</td>
                <td>
                  {selectedServices.some(s => s.id === service.id && s.type === "domestic") ? (
                    <button onClick={() => removeService(service, "domestic")} className="remove-button">-</button>
                  ) : (
                    <button onClick={() => addService(service, "domestic")} className="add-button">+</button>
                  )}
                </td>
                <td>₹{service.foreignPrice}</td>
                <td>
                  {selectedServices.some(s => s.id === service.id && s.type === "foreign") ? (
                    <button onClick={() => removeService(service, "foreign")} className="remove-button">-</button>
                  ) : (
                    <button onClick={() => addService(service, "foreign")} className="add-button">+</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="checkout-section">
        <h2>Total Price: ₹{amount}</h2>
        <div className="user-info">
          <input
            type="text"
            placeholder="Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={userInfo.contact}
            onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          />
        </div>
        <button className="checkout-button" onClick={checkoutHandler}>Checkout</button>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;
