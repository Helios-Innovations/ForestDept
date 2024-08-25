import React, { useState } from "react";
import Navbar from "./Navbar"; // Import the Navbar component
import "./App.css";
import axios from 'axios';

// Updated services array with more booking options
const services = [
  { id: 1, name: "Tree Cutting Permit", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1 },
  { id: 2, name: "Wildlife Safari (Indian)", image: "https://media.istockphoto.com/id/598520904/photo/green-forest-foliage-aerial-view-woodland-tree-canopy-nature-background.jpg?s=2048x2048&w=is&k=20&c=ymqZTFwlLU1ZXH6KZipayaSJZ_yJgXOFBmLuNHMJftI=", price: 1 },
  { id: 3, name: "Wildlife Safari (Foreigner)", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 4, name: "Forest Camping", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 5, name: "Fishing License", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1 },
  { id: 6, name: "Car Booking for Safari (Indian)", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1 },
  { id: 7, name: "Car Booking for Safari (Foreigner)", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 8, name: "2-Wheeler Booking", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 9, name: "Tour Guide (Half Day)", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 10, name: "Tour Guide (Full Day)", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 11, name: "Bird Watching Tour", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
  { id: 12, name: "Nature Photography Workshop", image: "https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg", price: 1},
];

const ServiceCard = ({ service, onAdd, onRemove, isSelected }) => {
  return (
    <div className="card">
      <img src={service.image} alt={service.name} className="card-image" />
      <div className="card-content">
        <h3>{service.name}</h3>
        <p>Price: ₹{service.price}</p>
        {isSelected ? (
          <button onClick={() => onRemove(service)} className="remove-button">-</button>
        ) : (
          <button onClick={() => onAdd(service)} className="add-button">+</button>
        )}
      </div>
    </div>
  );
};

function Home() {
  const [selectedServices, setSelectedServices] = useState([]);

  const addService = (service) => {
    setSelectedServices([...selectedServices, service]);
  };

  const removeService = (service) => {
    setSelectedServices(selectedServices.filter(s => s.id !== service.id));
  };

  const amount = selectedServices.reduce((sum, service) => sum + service.price, 0);

  async function checkoutHandler() {
    try {
      const { data: { key } } = await axios.get("http://localhost:5000/api/getkey");

      const { data: { order } } = await axios.post("http://localhost:5000/api/v1/checkout", {
        amount
      });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Forest",
        description: "Payment integration",
        image: "https://logo.com/image-cdn/images/kts928pd/production/396f6f3c7f506eb9674c2a6e244249faeda83b00-424x419.png?w=1080&q=72",
        order_id: order.id,
        callback_url: `http://localhost:5000/api/v1/paymentverification`,
        prefill: {
          name: "Prashant Kumar Jha",
          email: "jhakumarprasant111@gmail.com",
          contact: "9999999999"
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
        // addOrderToDatabase(options);
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
      <div className="services-container">
        {services.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <ServiceCard
              key={service.id}
              service={service}
              onAdd={addService}
              onRemove={removeService}
              isSelected={isSelected}
            />
          );
        })}
      </div>
      <div className="checkout-section">
        <h2>Total Price: ₹{amount}</h2>
        <button className="checkout-button" onClick={checkoutHandler}>Checkout</button>
      </div>
    </div>
  );
}

export default Home;
