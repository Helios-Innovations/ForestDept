import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const Navbar = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/login");
  };
  const  gotoDashBoard=()=>{
   // localStorage.removeItem("Admin")
    navigate('/dashboard')
  }
  const handleClick = () => {
    if (localStorage.getItem("Admin")) {
      gotoDashBoard();
    } else {
      handleAdminLogin();
    }
  };

  return (
    <div className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#2C3E50", color: "#fff" }}>
      <div className="navbar-heading" style={{ fontSize: "24px", fontWeight: "bold" }}>Forest Department Services</div>
      <div className="navbar-contact" style={{ display: "flex", alignItems: "center" }}>
        <div className="contact-item" style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
          <FaPhoneAlt /> <span style={{ marginLeft: "5px" }}>+91 9876543210</span>
        </div>
        <div className="contact-item" style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
          <FaEnvelope /> <span style={{ marginLeft: "5px" }}>info@forestdept.com</span>
        </div>
        <button
          onClick={ handleClick}
          style={{
            backgroundColor: "#E74C3C",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {localStorage.getItem("Admin") ? "DashBoard" : "Admin Login"}
        </button>

      </div>
    </div>
  );
};

export default Navbar;
