import { useEffect, useState } from "react";

function App() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applications")
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Hunter Dashboard</h1>

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;