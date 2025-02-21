import React from 'react';

const VariantSelector = ({ label, options, selected, onChange }) => {
  return (
    <div className="variant-selector">
      <label>{label}:</label>
      <select 
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariantSelector;