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

      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.company} — {app.position} — {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;