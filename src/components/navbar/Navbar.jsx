import React from "react";
import "./Navbar.css";

import logoIcon from "../../assets/LOGO/TVBG.png";
import logoText from "../../assets/LOGO/ICTV.png";
import tagline from "../../assets/LOGO/TX.png";

const Navbar = ({
  dateRange,
  handleDateChange,
  handleAdminClick,
  pageTitle = "Business Metrics Dashboard",
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <img src={logoIcon} alt="TruVish Logo" className="logo-icon" />
          <div className="tagline-container">
            <img src={logoText} alt="TRUVISH" className="logo-text" />
            <img
              src={tagline}
              alt="A Partner in Reward Marketing"
              className="tagline"
            />
          </div>
        </div>

        <h1 className="dashboard-title">{pageTitle}</h1>
      </div>

      <div className="navbar-right">
        <div className="date-selector">
          <span>📅</span>
          <select value={dateRange} onChange={handleDateChange}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Quarter</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div
          className="admin-icon"
          title="Admin Profile"
          onClick={handleAdminClick}
        >
          A
        </div>
      </div>
    </nav>
  );
};

export default Navbar;