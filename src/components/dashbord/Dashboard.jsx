import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar.jsx";
import ClientOverview from "../clientsoverview/ClientsOverview.jsx";

const API_BASE_URL = "https://truvish-backend-production.up.railway.app";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("30");
  const [activePage, setActivePage] = useState("dashboard");

  const [summary, setSummary] = useState({
    totalClients: 0,
    totalUsers: 0,
    totalCurrentBalance: 0,
    totalLoadValue: 0,
    totalCodesDistributed: 0,
    totalDistributedValue: 0,
    totalRedeemedCount: 0,
    totalRedeemedAmount: 0,
  });

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const cards = document.querySelectorAll(
      ".metric-card, .profitability-framework, .readiness-card, .client-overview-card"
    );

    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`;
    });
  }, [activePage, summary.totalClients]);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoadingSummary(true);
      setSummaryError("");

      const response = await fetch(`${API_BASE_URL}/api/clients/dashboard-summary`);

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard summary. Status: ${response.status}`);
      }

      const data = await response.json();

      setSummary({
        totalClients: Number(data?.totalClients ?? 0),
        totalUsers: Number(data?.totalUsers ?? 0),
        totalCurrentBalance: Number(data?.totalCurrentBalance ?? 0),
        totalLoadValue: Number(data?.totalLoadValue ?? 0),
        totalCodesDistributed: Number(data?.totalCodesDistributed ?? 0),
        totalDistributedValue: Number(data?.totalDistributedValue ?? 0),
        totalRedeemedCount: Number(data?.totalRedeemedCount ?? 0),
        totalRedeemedAmount: Number(data?.totalRedeemedAmount ?? 0),
      });
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      setSummaryError(error.message || "Failed to load dashboard summary");
      setSummary({
        totalClients: 0,
        totalUsers: 0,
        totalCurrentBalance: 0,
        totalLoadValue: 0,
        totalCodesDistributed: 0,
        totalDistributedValue: 0,
        totalRedeemedCount: 0,
        totalRedeemedAmount: 0,
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return `₹${value.toFixed(2)}`;
  };

  const formatCount = (value) => {
    return Number(value || 0).toLocaleString();
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateRange(value);

    if (value === "custom") {
      alert(
        "Custom date range selection will be available after launch. For now, metrics show available live data only."
      );
    } else {
      console.log(`Date range changed to: Last ${value} days`);
    }
  };

  const handleAdminClick = () => {
    alert("Admin profile functionality will be implemented after launch.");
  };

  const handleClientOverview = () => {
    setActivePage("clientOverview");
  };

  const redemptionRate =
    summary.totalDistributedValue > 0
      ? `${(
          (summary.totalRedeemedAmount / summary.totalDistributedValue) *
          100
        ).toFixed(1)}%`
      : "0.0%";

  const metricCards = [
    {
      icon: "👥",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Clients",
      description: "Total businesses using TruVish for reward marketing campaigns",
      value: loadingSummary ? "..." : formatCount(summary.totalClients),
      change: summaryError
        ? "Client count unavailable"
        : `${formatCount(summary.totalClients)} active clients`,
      isClientsCard: true,
    },
    {
      icon: "🎯",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Users",
      description: "End users receiving and redeeming reward codes",
      value: loadingSummary ? "..." : formatCount(summary.totalUsers),
      change: "Unique users from redemption activity",
    },
    {
      icon: "💰",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Load Value",
      description: "Total amount loaded by TruVish into all client wallets",
      value: loadingSummary ? "..." : formatCurrency(summary.totalLoadValue),
      change: "All successful wallet credits combined",
    },
    {
      icon: "📨",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Distributed Codes",
      description: "Total distributed voucher value across all issued codes",
      value: loadingSummary ? "..." : formatCurrency(summary.totalDistributedValue),
      change: loadingSummary
        ? "Loading..."
        : `${formatCount(summary.totalCodesDistributed)} codes issued`,
    },
    {
      icon: "✅",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Redeemed Codes",
      description: "Total redeemed voucher value from all successful redemptions",
      value: loadingSummary ? "..." : formatCurrency(summary.totalRedeemedAmount),
      change: loadingSummary
        ? "Loading..."
        : `${formatCount(summary.totalRedeemedCount)} redemptions completed`,
    },
    {
      icon: "📊",
      status: loadingSummary ? "Loading" : "Live Data",
      statusClass: loadingSummary ? "status-pending" : "status-ready",
      title: "Redemption Rate",
      description: "Redeemed value as a percentage of distributed value",
      value: loadingSummary ? "..." : redemptionRate,
      change: "Based on distributed value vs redeemed value",
    },
  ];

  if (activePage === "clientOverview") {
    return (
      <div className="dashboard-page">
        <Navbar
          dateRange={dateRange}
          handleDateChange={handleDateChange}
          handleAdminClick={handleAdminClick}
          pageTitle="Business Metrics Dashboard › Clients Overview"
        />

        <div className="container">
          <ClientOverview apiBaseUrl={API_BASE_URL} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar
        dateRange={dateRange}
        handleDateChange={handleDateChange}
        handleAdminClick={handleAdminClick}
        pageTitle="Business Metrics Dashboard"
      />

      <div className="container">
        <section className="section">
          <h2 className="section-title">Key Platform Metrics</h2>

          {summaryError && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#fff4f4",
                color: "#b42318",
                border: "1px solid #fecdca",
              }}
            >
              Failed to load dashboard summary: {summaryError}
            </div>
          )}

          <div className="card-grid">
            {metricCards.map((card, index) => (
              <div
                className={`metric-card ${card.isClientsCard ? "clients-card" : ""}`}
                key={index}
              >
                <div className="metric-header">
                  <div className="metric-icon">{card.icon}</div>
                  <span className={`status-badge ${card.statusClass}`}>
                    {card.status}
                  </span>
                </div>

                <div className="metric-card-body">
                  <h3 className="metric-title">{card.title}</h3>

                  {!card.isClientsCard && (
                    <p className="metric-description">{card.description}</p>
                  )}

                  <div className="metric-value">{card.value}</div>

                  {card.isClientsCard ? (
                    <p className="metric-change positive-change">
                      <span className="change-number">{formatCount(summary.totalClients)}</span>{" "}
                      <span className="change-text">total clients</span>
                    </p>
                  ) : (
                    <p className="metric-change">{card.change}</p>
                  )}
                </div>

                {card.isClientsCard && (
                  <button
                    className="client-overview-btn"
                    onClick={handleClientOverview}
                  >
                    <span>Client Overview</span>
                    <span className="arrow">›</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Revenue Tracking</h2>
          <div className="card-grid card-grid-2">
            <div className="metric-card revenue-card">
              <div className="metric-header">
                <div className="metric-icon">💳</div>
                <span className="status-badge status-pending">
                  Pending Activation
                </span>
              </div>
              <h3 className="metric-title">Service Fee Earnings</h3>
              <p className="metric-description">
                Platform fee charged for reward campaign usage and management
              </p>
              <div className="metric-value">₹0.00</div>
              <p className="metric-change">
                Fee tracking can be added in the next phase
              </p>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{ height: "20%" }}></div>
                <div className="chart-bar" style={{ height: "35%" }}></div>
                <div className="chart-bar" style={{ height: "15%" }}></div>
                <div className="chart-bar" style={{ height: "45%" }}></div>
                <div className="chart-bar" style={{ height: "30%" }}></div>
                <div className="chart-bar" style={{ height: "25%" }}></div>
              </div>
            </div>

            <div className="metric-card revenue-card">
              <div className="metric-header">
                <div className="metric-icon">📈</div>
                <span className="status-badge status-pending">
                  Pending Activation
                </span>
              </div>
              <h3 className="metric-title">Margin Earnings</h3>
              <p className="metric-description">
                Margin generated from reward voucher procurement and distribution
              </p>
              <div className="metric-value">₹0.00</div>
              <p className="metric-change">
                Margin tracking can be added in the next phase
              </p>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{ height: "30%" }}></div>
                <div className="chart-bar" style={{ height: "40%" }}></div>
                <div className="chart-bar" style={{ height: "25%" }}></div>
                <div className="chart-bar" style={{ height: "50%" }}></div>
                <div className="chart-bar" style={{ height: "35%" }}></div>
                <div className="chart-bar" style={{ height: "45%" }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Operational Expense Tracking</h2>
          <div className="card-grid card-grid-2">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">📢</div>
                <span className="status-badge status-ready">Tracking Ready</span>
              </div>
              <h3 className="metric-title">Marketing Load</h3>
              <p className="metric-description">
                Budget allocated to reward marketing incentives and promotional
                campaigns
              </p>
              <div className="metric-value">₹0.00</div>
              <p className="metric-change">Expense tracking is ready to connect</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">💸</div>
                <span className="status-badge status-ready">Tracking Ready</span>
              </div>
              <h3 className="metric-title">Cashback Load</h3>
              <p className="metric-description">
                Cashback value distributed to end users through the platform
              </p>
              <div className="metric-value">₹0.00</div>
              <p className="metric-change">Expense tracking is ready to connect</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Profitability Framework</h2>
          <div className="profitability-framework">
            <div className="equation-container">
              <div className="equation-item">
                <div className="equation-label">Revenue</div>
                <div className="equation-value">₹0.00</div>
              </div>
              <div className="equation-operator">−</div>
              <div className="equation-item">
                <div className="equation-label">Expenses</div>
                <div className="equation-value">₹0.00</div>
              </div>
              <div className="equation-operator">=</div>
              <div className="equation-item">
                <div className="equation-label">Net Profit</div>
                <div className="equation-value">₹0.00</div>
              </div>
            </div>

            <div className="profitability-note">
              💡 <strong>Automated Profitability Analysis:</strong> This dashboard will automatically calculate platform profitability once campaigns begin. The system tracks all revenue sources and operational expenses in real-time.
            </div>

            <div className="formula-display">
              Net Profit = (Service Fees + Margin Earnings) - (Marketing Load +
              Cashback Load)
            </div>
          </div>
        </section>

        <section className="section">
          <div className="readiness-card">
            <div className="readiness-title">
              <span>🚀</span>
              <span>System Readiness</span>
            </div>
            <p className="readiness-description">
              TruVish is designed to track the complete reward marketing lifecycle — from code generation to redemption, revenue capture, and profitability analysis. Our platform provides real-time visibility into all critical business metrics.
            </p>

            <div className="readiness-features">
              <div className="readiness-feature">
                <span className="checkmark">✓</span>
                <span>Code Generation</span>
              </div>
              <div className="readiness-feature">
                <span className="checkmark">✓</span>
                <span>Redemption Tracking</span>
              </div>
              <div className="readiness-feature">
                <span className="checkmark">✓</span>
                <span>Value Analytics</span>
              </div>
              <div className="readiness-feature">
                <span className="checkmark">✓</span>
                <span>Profitability View</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
