import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const statusOptions = ["Applied", "Interview", "Hired", "Rejected"];

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  function loadApplications() {
    fetch("http://127.0.0.1:8000/applications")
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function deleteApplication(appId) {
    fetch(`http://127.0.0.1:8000/applications/${appId}`, {
      method: "DELETE",
    }).then(() => {
      loadApplications();
    });
  }

  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  function addApplication(event) {
    event.preventDefault();

    if (!company.trim()) {
      setFormError("Company is required.");
      return;
    }

    if (!position.trim()) {
      setFormError("Position is required.");
      return;
    }

    if (!status.trim()) {
      setFormError("Status is required.");
      return;
    }

    setFormError("");

    const newApplication = {
      company: company,
      position: position,
      status: status,
      applied_date: appliedDate || getTodayDate(),
      notes: notes,
    };

    fetch("http://127.0.0.1:8000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newApplication),
    }).then(() => {
      loadApplications();
      setCompany("");
      setPosition("");
      setStatus("");
      setAppliedDate("");
      setNotes("");
      setFormError("");
    });
  }

  function startEditing(app) {
    setEditingId(app.id);
    setEditStatus(app.status);
    setEditNotes(app.notes || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditStatus("");
    setEditNotes("");
  }

  function saveEdit(app) {
    const updatedApplication = {
      company: app.company,
      position: app.position,
      status: editStatus,
      applied_date: app.applied_date,
      notes: editNotes,
    };

    fetch(`http://127.0.0.1:8000/applications/${app.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedApplication),
    }).then(() => {
      loadApplications();
      cancelEditing();
    });
  }

  function getStatusStyle(status) {
    switch (status.toLowerCase()) {
      case "applied":
        return {
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "interview":
        return {
          backgroundColor: "#b45309",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "hired":
        return {
          backgroundColor: "#166534",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "rejected":
        return {
          backgroundColor: "#991b1b",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      default:
        return {
          backgroundColor: "#374151",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
        };
    }
  }

  return (
    <div className="container">
      <h1>Job Hunter Dashboard</h1>

      <h2>Add Application</h2>

      {formError && (
        <p className="error-message">{formError}</p>
      )}

      <form onSubmit={addApplication} className="form-row">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <h2>Applications</h2>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications
              .filter((app) =>
                app.company.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter((app) =>
                statusFilter === "All" ? true : app.status === statusFilter
              )
              .map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.company}</td>
                  <td>{app.position}</td>

                  <td>
                    {editingId === app.id ? (
                      <select
                        className="inline-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span style={getStatusStyle(app.status)}>{app.status}</span>
                    )}
                  </td>

                  <td>{app.applied_date}</td>

                  <td>
                    {editingId === app.id ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    ) : (
                      app.notes
                    )}
                  </td>

                  <td>
                    <div className="actions">
                      {editingId === app.id ? (
                        <>
                          <button
                            className="action-button"
                            onClick={() => saveEdit(app)}
                          >
                            Save
                          </button>

                          <button
                            className="action-button"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-button"
                            onClick={() => startEditing(app)}
                          >
                            Edit
                          </button>

                          <button
                            className="action-button"
                            onClick={() => deleteApplication(app.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}

export default App;