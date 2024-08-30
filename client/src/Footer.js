import React from 'react'
import './Footer.css'
export const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-container">
      <div className="footer-about">
        <h3>About Us</h3>
        <p>
          The Forest Department is dedicated to the conservation and management of forest resources. We strive to protect wildlife and maintain the natural balance in our ecosystem.
        </p>
      </div>
  
      <div className="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
  
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p>Email: info@forestdepartment.com</p>
        <p>Phone: +91 12345 67890</p>
        <p>Address: 123 Green Avenue, Forest City, India</p>
      </div>
    </div>
  
    <div className="footer-bottom">
      <p>&copy; 2024 Forest Department. All Rights Reserved.</p>
    </div>
  </footer>
  
  )
}
