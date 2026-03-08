import { useEffect, useState } from "react";

function App() {
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");

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

  function addApplication(event) {
    event.preventDefault();

    const newApplication = {
      company: company,
      position: position,
      status: status,
      applied_date: appliedDate,
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
    });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Hunter Dashboard</h1>

      <h2>Add Application</h2>

      <form onSubmit={addApplication} style={{ marginBottom: "20px" }}>
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
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
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

      <table border="1" cellPadding="10">
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
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.company}</td>
              <td>{app.position}</td>
              <td>{app.status}</td>
              <td>{app.applied_date}</td>
              <td>{app.notes}</td>
              <td>
                <button onClick={() => deleteApplication(app.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;