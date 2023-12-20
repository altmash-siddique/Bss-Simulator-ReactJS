import React from 'react'

const Card = ({ title, fields, children, onInputChange }) => {
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    onInputChange(fieldName, value);

    console.log(value)
  };
  return (
    <div className="card">
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <div className="input-group" key={index}>
          <label htmlFor={field.name} style={{ minWidth: '200px', marginRight: '10px' }}>{field.label}:</label>
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
  )
}

export default Card