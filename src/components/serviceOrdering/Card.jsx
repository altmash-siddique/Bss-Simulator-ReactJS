import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const Card = ({
  title,
  fields,
  children,
  onInputChange,
  highlight,
  index,
  onCloseClick,
  localInitialValues,
}) => {
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    onInputChange(fieldName, value);
  };

  const trimLabelPrefix = (label) => {
    const separatorIndex = label.indexOf(".");
    return separatorIndex !== -1 ? label.substring(separatorIndex + 1) : label;
  };

  const handleCloseClick = () => {
    if (onCloseClick) {
      onCloseClick(index);
    }
  };
  console.log("Card initial values", localInitialValues);
  // console.log(fields)

  return (
    <div className={`card ${highlight ? "highlight" : ""}`}>
      {highlight && <div className="ribbon">Added Now</div>}
      {onCloseClick && (
        <CloseIcon className="close-icon" onClick={handleCloseClick} />
      )}
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
            id={field.name}
            name={field.name}
            value={localInitialValues?.[field.name]}
            placeholder={field.placeHolder}
            onChange={(e) => handleInputChange(e, field.name)}
          />
        </div>
      ))}
      {children}
    </div>
  );
};

export default Card;
