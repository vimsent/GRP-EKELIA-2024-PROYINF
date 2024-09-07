import React from 'react';
import cornerstone from 'cornerstone-core';

const ColorMapButton = ({ map }) => {
  const applyColorMap = () => {
    const element = document.querySelector('.image-viewer');
    const viewport = cornerstone.getViewport(element);
    viewport.colormap = map;
    cornerstone.setViewport(element, viewport);
  };

  return (
    <button onClick={applyColorMap}>
      {map.charAt(0).toUpperCase() + map.slice(1)}
    </button>
  );
};

export default ColorMapButton;
