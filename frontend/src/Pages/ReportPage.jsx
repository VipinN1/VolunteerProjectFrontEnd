import React, { useState, useEffect } from "react";
import "./Report.css";

const ReportPage = () => {
  const [reportDetails, setReportDetails] = useState({
    subject: "",
    format: "",
  });

  // WIP - Use to avoid unauthorized usage from non-admins later? May need to change tokens and database a bit.
  useEffect(() => {
    const userID = sessionStorage.getItem("auth-token"); // Assume userID is stored after login
    if (!userID) return;
  }, []);

  const subjects = ["Volunteers and Participation History", "Event Details and Volunteer Assignments"];

  const formats = ["PDF", "CSV"];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Generate Report)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:5000/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportDetails),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
  
      const blob = await response.blob();
  
      // Decide file name based on type
      const fileName =
        reportDetails.subject.includes("Event")
          ? `event-report.${reportDetails.format.toLowerCase()}`
          : `volunteer-report.${reportDetails.format.toLowerCase()}`;
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      // Optional: Clean up blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };
  

  return (
    <div className="report-page">
      <title>Volunteer Site - Reports</title>
      <div className="report-container">
        <h2>Generate Reports</h2>

        <form onSubmit={handleSubmit}>
          <label>Report Subject *</label>
          <select name="subject" required value={reportDetails.subject} onChange={handleChange}>
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <label>Report Format *</label>
          <select name="format" required value={reportDetails.format} onChange={handleChange}>
            <option value="">Select a file format</option>
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>

          <button type="submit">Generate Report</button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;