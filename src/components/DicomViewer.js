import React, { useRef, useEffect, useState } from 'react';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import './styles.css';
import ColorMapButton from './ColorMapButton'; // Importar el componente ColorMapButton

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
});

const DicomViewer = () => {
  const divRef = useRef(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [inverted, setInverted] = useState(false);
  const [showBrightnessContrastControls, setShowBrightnessContrastControls] = useState(false);
  const [showRGBControls, setShowRGBControls] = useState(false);
  const [red, setRed] = useState(1);
  const [green, setGreen] = useState(1);
  const [blue, setBlue] = useState(1);

  useEffect(() => {
    const element = divRef.current;
    cornerstone.enable(element);

    return () => {
      cornerstone.disable(element);
    };
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      resetValues();
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      cornerstone.loadImage(imageId).then((image) => {
        cornerstone.displayImage(divRef.current, image);
        updateViewport();
      });
    }
  };

  const invertColors = () => {
    setInverted(!inverted);
    const element = divRef.current;
    const viewport = cornerstone.getViewport(element);
    viewport.invert = !viewport.invert;
    cornerstone.setViewport(element, viewport);
  };

  const handleBrightnessChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setBrightness(value);
    updateViewport();
  };

  const handleContrastChange = (event) => {
    const value = parseFloat(event.target.value);
    setContrast(value);
    updateViewport();
  };

  const updateViewport = () => {
    const element = divRef.current;
    const viewport = cornerstone.getViewport(element);
    if (viewport) {
      viewport.voi.windowWidth = 256 * contrast;
      viewport.voi.windowCenter = 128 + brightness;
      viewport.invert = inverted;
      cornerstone.setViewport(element, viewport);
    }
  };

  const updateRGB = (colormapName) => {
    const element = divRef.current;
    const viewport = cornerstone.getViewport(element);
    const colormap = cornerstone.colors.getColormap(colormapName);
    
    // Ajustar los colores según el nombre del mapa de colores
    switch(colormapName) {
      case 'hot':
        colormap.setColor(0, red, green, blue);
        break;
      case 'viridis':
        // Cambiar a azul
        colormap.setColor(0, red, green, blue);
        break;
      case 'gray':
        // Cambiar a verde
        colormap.setColor(0, red, green, blue);
        break;
      case 'blue':
        // Cambiar a tonos azules
        colormap.setColor(0, red, green, blue);
        break;
      case 'yellow':
        // Cambiar a tonos amarillos
        colormap.setColor(0, red, green, blue);
        break;
      // Agregar más casos según sea necesario para otros mapas de colores
      default:
        // Por defecto, mantener los mismos colores para cualquier otro mapa de colores
        colormap.setColor(0, red, green, blue);
    }
    
    viewport.colormap = colormap;
    cornerstone.setViewport(element, viewport);
  };
  
  
  const toggleBrightnessContrastControls = () => {
    setShowBrightnessContrastControls(!showBrightnessContrastControls);
  };

  const toggleRGBControls = () => {
    setShowRGBControls(!showRGBControls);
  };

  const resetValues = () => {
    setBrightness(0);
    setContrast(1);
    setInverted(false);
    setRed(1);
    setGreen(1);
    setBlue(1);
    updateViewport();
  };

  return (
    <div className="container">
      <h1>Visor DICOM</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        Subir Archivo DICOM
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <button onClick={invertColors}>Invertir Colores</button>
      <button onClick={toggleBrightnessContrastControls}>Brillo / Contraste</button>
      {showBrightnessContrastControls && (
        <div>
          <label>
            Brillo:
            <input
              type="range"
              min="-128"
              max="128"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </label>
          <label>
            Contraste:
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={contrast}
              onChange={handleContrastChange}
            />
          </label>
        </div>
      )}
      <button onClick={toggleRGBControls}>RGB</button>
      {showRGBControls && (
  <div>
    <ColorMapButton colormapName="hot" onClick={updateRGB} />
    <ColorMapButton colormapName="viridis" onClick={updateRGB} />
    <ColorMapButton colormapName="gray" onClick={updateRGB} />
    <ColorMapButton colormapName="blue" onClick={updateRGB} />
    <ColorMapButton colormapName="yellow" onClick={updateRGB} />
    {/* Agrega más botones según sea necesario */}
  </div>
)}

      <div id="dicom-image" ref={divRef}></div>
    </div>
  );
};

export default DicomViewer;
