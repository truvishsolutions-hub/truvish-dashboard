import React, { useEffect, useMemo, useState } from "react";
import "./ClientsOverview.css";

const ClientOverview = ({
  apiBaseUrl = "https://truvish-backend-production.up.railway.app"
}) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = "";
};

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = clients.filter((client) => {
      return (
        String(client.id || "").toLowerCase().includes(query) ||
        String(client.companyName || "").toLowerCase().includes(query) ||
        String(client.clientName || "").toLowerCase().includes(query) ||
        String(client.mobileNumber || "").toLowerCase().includes(query) ||
        String(client.email || "").toLowerCase().includes(query)
      );
    });

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiBaseUrl}/api/clients/overview`);

      if (!response.ok) {
        throw new Error(`Failed to fetch client overview. Status: ${response.status}`);
      }

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];

      setClients(safeData);
      setFilteredClients(safeData);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients");
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / entriesPerPage));

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredClients.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredClients, currentPage, entriesPerPage]);

  const startEntry =
    filteredClients.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;

  const endEntry = Math.min(currentPage * entriesPerPage, filteredClients.length);

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return `₹ ${value.toFixed(2)}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const getLogoUrl = (client) => {
    if (!client?.id || !client?.logoImg) return "";
    return `${apiBaseUrl}/api/clients/${client.id}/logo`;
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Company Name",
      "Client Name",
      "Mobile Number",
      "Email",
      "Current Balance",
      "Total Load",
      "Distributed Value",
      "Redeemed Amount",
      "Created At",
    ];

    const rows = filteredClients.map((client) => [
      client.id ?? "",
      client.companyName ?? "",
      client.clientName ?? "",
      client.mobileNumber ?? "",
      client.email ?? "",
      client.currentBalance ?? 0,
      client.totalLoad ?? 0,
      client.distributedValue ?? 0,
      client.redeemedAmount ?? 0,
      client.createdAt ?? "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clients-overview.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="client-overview-page">
      <section className="section">
        <h2 className="section-title">Clients Overview</h2>

        <div className="client-overview-card">
          <div className="client-overview-toolbar">
            <div className="client-search-box">
              <span className="client-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="export-btn" onClick={fetchClients}>
                <span className="export-icon">↻</span>
                <span>Refresh</span>
              </button>

              <button className="export-btn" onClick={exportCSV}>
                <span className="export-icon">⬇</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: "18px", textAlign: "center" }}>
              Loading clients...
            </div>
          )}

          {error && (
            <div
              style={{
                margin: "16px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#fff4f4",
                color: "#b42318",
                border: "1px solid #fecdca",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="table-wrapper">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Logo</th>
                      <th>Company Name</th>
                      <th>Client Name</th>
                      <th>Mobile Number</th>
                      <th>Contact Email ID</th>
                      <th>Current Balance</th>
                      <th>Total Load</th>
                      <th>₹Distributed Value</th>
                      <th>Redeemed Amount</th>
                      <th>Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedClients.length > 0 ? (
                      paginatedClients.map((client) => (
                        <tr key={client.id}>
                          <td className="id-cell">{client.id}</td>

                          <td>
                            {client.logoImg ? (
                              <img
                                src={getLogoUrl(client)}
                                alt={client.companyName || "Client Logo"}
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #eaecf0",
                                  background: "#fff",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="logo-box">
                                {(client.companyName || "C").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </td>

                          <td>
                            <span className="company-name">
                              {client.companyName || "-"}
                            </span>
                          </td>

                          <td>{client.clientName || "-"}</td>
                          <td>{client.mobileNumber || "-"}</td>
                          <td className="email-cell">{client.email || "-"}</td>
                          <td className="amount-cell">
                            {formatCurrency(client.currentBalance)}
                          </td>
                          <td className="amount-cell">
                            {formatCurrency(client.totalLoad)}
                          </td>
                          <td className="amount-cell">
                            {formatCurrency(client.distributedValue)}
                          </td>
                          <td className="amount-cell">
                            {formatCurrency(client.redeemedAmount)}
                          </td>
                          <td>{formatDate(client.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                          No clients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <div className="table-footer-left">
                  <span>
                    Showing {startEntry} to {endEntry} of {filteredClients.length} entries
                  </span>

                  <select
                    className="entries-select"
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <button className="page-btn active">{currentPage}</button>

                  <button
                    className="page-btn arrow-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>

                  <button
                    className="page-btn next-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientOverview;