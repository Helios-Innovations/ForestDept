import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./baseurl";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("booking");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate=useNavigate()
  // Fetch data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/allTransaction`);
        setOrders(response.data.allTransactions);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    
    fetchOrders();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = orders.filter(order => new Date(order.createdAt).toISOString().split('T')[0] === today);
  const totalToday = todayBookings.reduce((acc, order) => acc + order.amount, 0);
  const totalPreviousDays = orders.filter(order => new Date(order.createdAt).toISOString().split('T')[0] !== today)
    .reduce((acc, order) => acc + order.amount, 0);

  const bookingsToday = todayBookings.length;
  const bookingsPreviousDays = orders.filter(order => new Date(order.createdAt).toISOString().split('T')[0] !== today).length;

  const dataAmount = {
    labels: ['Today', 'Previous Days'],
    datasets: [
      {
        label: 'Total Amount',
        data: [totalToday, totalPreviousDays],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  };

  const dataBookings = {
    labels: ['Today', 'Previous Days'],
    datasets: [
      {
        label: 'Number of Bookings',
        data: [bookingsToday, bookingsPreviousDays],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }
    ]
  };

  const handleSearch = () => {
    const result = orders.find(order => order.razorpay_order_id === searchTerm);
    setSearchResult(result || null);
  };

  const handleLogout = () => {
     localStorage.removeItem("Admin")
     navigate('/login')
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul>
          <li onClick={() => setSelectedOption("booking")} className={selectedOption === "booking" ? "active" : ""}>Booking</li>
          <li onClick={() => setSelectedOption("analyze")} className={selectedOption === "analyze" ? "active" : ""}>Analyze</li>
          <li onClick={() => setSelectedOption("search")} className={selectedOption === "search" ? "active" : ""}>Search by Transaction ID</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <div className="main-content">
        {selectedOption === "booking" && (
          <div>
            <h2>Today's Bookings</h2>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Services</th>
                  <th>Amount</th>
                  <th>Booking Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((order, index) => (
                  <tr key={index}>
                    <td>{order.userInfo.name}</td>
                    <td>{order.userInfo.contact}</td>
                    <td>{order.userInfo.email}</td>
                    <td>{order.services.map(service => service.name).join(", ")}</td>
                    <td>${order.amount}</td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedOption === "analyze" && (
          <div>
            <h2>Analysis</h2>
            <div className="charts">
              <div className="chart">
                <Bar data={dataAmount} options={{ responsive: true }} />
              </div>
              <div className="chart">
                <Line data={dataAmount} options={{ responsive: true }} />
              </div>
              <div className="chart">
                <Bar data={dataBookings} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        )}
        {selectedOption === "search" && (
          <div>
            <h2>Search by Transaction ID</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Transaction ID"
            />
            <button onClick={handleSearch}>Search</button>
            {searchResult && (
              <div>
                <h3>Search Result</h3>
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Services</th>
                      <th>Amount</th>
                      <th>Transaction ID</th>
                      <th>Booking Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{searchResult.userInfo.name}</td>
                      <td>{searchResult.userInfo.contact}</td>
                      <td>{searchResult.userInfo.email}</td>
                      <td>{searchResult.services.map(service => service.name).join(", ")}</td>
                      <td>${searchResult.amount}</td>
                      <td>{searchResult.razorpay_order_id}</td>
                      <td>{formatDate(searchResult.createdAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {searchTerm && !searchResult && (
              <p>No booking found with Transaction ID: {searchTerm}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
