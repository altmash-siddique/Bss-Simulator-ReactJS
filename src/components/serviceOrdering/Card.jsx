import React from "react";

const Card = ({ title, fields, children, onInputChange, highlight }) => {
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    onInputChange(fieldName, value);
  };

  const trimLabelPrefix = (label) => {
    const separatorIndex = label.indexOf(".");
    return separatorIndex !== -1 ? label.substring(separatorIndex + 1) : label;
  };

  return (
    <div className={`card ${highlight ? 'highlight' : ''}`}>
      {highlight && <div className="ribbon">Added Now</div>}
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <div className="input-group" key={index}>
          <label
            htmlFor={field.name}
            style={{ minWidth: "200px", marginRight: "10px" }}
          >
            {trimLabelPrefix(field.label)}:
          </label>
          <input
            className="input-field"
            type={field.type}
            id={field.name}
            name={field.name}
            onChange={(e) => handleInputChange(e, field.name)}
          />
        </div>
      ))}
      {children}
    </div>
  );
};

export default Card;
