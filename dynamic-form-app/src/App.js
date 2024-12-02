import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu & Kashmir"];

  const apiResponses = {
    "User Information": { fields: [{ name: "firstName", type: "text", label: "First Name", required: true }, { name: "lastName", type: "text", label: "Last Name", required: true }, { name: "age", type: "number", label: "Age", required: true }] },
    "Address Information": { fields: [{ name: "street", type: "text", label: "Street", required: true }, { name: "city", type: "text", label: "City", required: true }, { name: "state", type: "dropdown", label: "State", options: indianStates, required: true }, { name: "zipCode", type: "text", label: "Zip Code" }] },
    "Payment Information": { fields: [{ name: "cardNumber", type: "text", label: "Card Number", required: true }, { name: "expiryDate", type: "date", label: "Expiry Date", required: true }, { name: "cvv", type: "password", label: "CVV", required: true }, { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }] }
  };

  const handleFormSelect = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);
    setFormFields(apiResponses[formType]?.fields || []);
    setFormData({});
    setFormErrors({});
    setProgress(0);
  };

  const handleInputChange = (e, name) => {
    const { value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      setProgress((Object.values(updatedData).filter(Boolean).length / formFields.length) * 100);
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = formFields.reduce((acc, { name, label, required }) => {
      if (required && !formData[name]) acc[name] = `${label} is required.`;
      return acc;
    }, {});
    if (Object.keys(validationErrors).length) return setFormErrors(validationErrors);

    setSubmittedData(prev => [...prev, formData]);
    setFormData({});
    setProgress(0);
    setFeedbackMessage("Form submitted successfully!");
  };

  const ProgressBar = () => (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      <div className="progress-bar-text">{Math.round(progress)}%</div>
    </div>
  );

  const renderField = ({ name, label, type, required, options }) => (
    <div className="form-group" key={name}>
      <label htmlFor={name}>{label}</label>
      {type === "dropdown" ? (
        <select value={formData[name] || ""} onChange={(e) => handleInputChange(e, name)} required={required}>
          <option value="">Select {label}</option>
          {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} id={name} name={name} value={formData[name] || ""} onChange={(e) => handleInputChange(e, name)} required={required} />
      )}
      {formErrors[name] && <div className="error-message">{formErrors[name]}</div>}
    </div>
  );

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData(prev => prev.filter((_, idx) => idx !== index));
    setFeedbackMessage("Changes saved successfully!");
  };

  const handleDelete = (index) => {
    setSubmittedData(prev => prev.filter((_, idx) => idx !== index));
    setFeedbackMessage("Entry deleted successfully!");
  };

  return (
    <div className="app-container">
      <header className="header"><h1>Dynamic Form</h1></header>
      <main>
        <div className="form-selection">
          <select onChange={handleFormSelect}>
            <option value="">Select Form Type</option>
            {["User Information", "Address Information", "Payment Information"].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {selectedForm && (
          <form onSubmit={handleSubmit} className="form-container">
            {formFields.map(renderField)}
            <ProgressBar />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        )}
        {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}
        {submittedData.length > 0 && (
          <div className="table-container">
            <h3>Submitted Form Data</h3>
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(submittedData[0]).map(key => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((entry, idx) => (
                  <tr key={idx}>
                    {Object.values(entry).map((value, i) => <td key={i}>{value}</td>)}
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(idx)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
