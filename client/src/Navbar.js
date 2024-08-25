import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-heading">Forest Department Services</div>
      <div className="navbar-contact">
        <div className="contact-item">
          <FaPhoneAlt /> <span>+91 9876543210</span>
        </div>
        <div className="contact-item">
          <FaEnvelope /> <span>info@forestdept.com</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
