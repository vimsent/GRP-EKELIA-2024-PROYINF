import React from 'react';

const ColorMapButton = ({ colormapName, onClick }) => {
  const handleClick = () => {
    onClick(colormapName);
  };

  return (
    <button onClick={handleClick}>{colormapName}</button>
  );
};

export default ColorMapButton;