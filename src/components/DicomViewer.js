import React, { useRef, useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import JSZip from 'jszip';
import './styles.css';
import ColorMapButton from './ColorMapButton';

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
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageCache = useRef({}); // Cache de imágenes

  useEffect(() => {
    const element = divRef.current;
    if (element) {
      cornerstone.enable(element);

      // Añadir el listener de la rueda del ratón para cambiar de imagen
      const handleWheel = (event) => {
        if (event.deltaY > 0) {
          nextImage();
        } else {
          prevImage();
        }
        event.preventDefault();
      };

      element.addEventListener('wheel', handleWheel);

      return () => {
        if (element) {
          cornerstone.disable(element);
          element.removeEventListener('wheel', handleWheel);
        }
      };
    }
  }, [images, currentImageIndex]);

  useEffect(() => {
    if (images.length > 0) {
      loadImage(images[currentImageIndex]);

      // Precargar las imágenes anteriores y siguientes
      prefetchImage(currentImageIndex + 1); // Siguiente imagen
      prefetchImage(currentImageIndex - 1); // Imagen anterior
    }
  }, [currentImageIndex, images]);

  const prefetchImage = (index) => {
    if (index >= 0 && index < images.length) {
      const imageId = images[index];
      if (!imageCache.current[imageId]) {
        cornerstone.loadImage(imageId).then((image) => {
          imageCache.current[imageId] = image;
        }).catch((error) => {
          console.error('Error precargando imagen:', error);
        });
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const zip = new JSZip();
      const zipContent = await file.arrayBuffer();
      const zipFile = await zip.loadAsync(zipContent);

      const imageEntries = [];
      zipFile.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && zipEntry.name.endsWith('.dcm')) {
          imageEntries.push({ name: zipEntry.name, entry: zipEntry });
        }
      });

      // Ordenar las imágenes por nombre
      imageEntries.sort((a, b) => a.name.localeCompare(b.name));

      const imagePromises = imageEntries.map((imageEntry) => imageEntry.entry.async('arraybuffer'));

      Promise.all(imagePromises).then((imageBuffers) => {
        const validImages = [];
        imageBuffers.forEach((buffer, index) => {
          try {
            const blob = new Blob([buffer], { type: 'application/dicom' });
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);
            validImages.push(imageId);
          } catch (error) {
            console.warn('No es una imagen DICOM válida:', index, error);
          }
        });

        setImages(validImages);
        if (validImages.length > 0) {
          loadImage(validImages[0]);
        }
      });
    }
  };

  const loadImage = (imageId) => {
    if (imageCache.current[imageId]) {
      displayImage(imageCache.current[imageId]);
    } else {
      cornerstone.loadImage(imageId).then((image) => {
        imageCache.current[imageId] = image;
        displayImage(image);
      }).catch((error) => {
        console.error('Error cargando imagen:', error);
      });
    }
  };

  const displayImage = (image) => {
    const element = divRef.current;
    if (element) {
      cornerstone.displayImage(element, image);
      updateViewport();
    }
  };

  const handleImageChange = (index) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const invertColors = () => {
    setInverted(!inverted);
    const element = divRef.current;
    if (element) {
      const viewport = cornerstone.getViewport(element);
      viewport.invert = !viewport.invert;
      cornerstone.setViewport(element, viewport);
    }
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
    if (element) {
      const viewport = cornerstone.getViewport(element);
      if (viewport) {
        viewport.voi.windowWidth = 256 * contrast;
        viewport.voi.windowCenter = 128 + brightness;
        viewport.invert = inverted;
        cornerstone.setViewport(element, viewport);
      }
    }
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
    updateViewport();
  };

  const setToBlackAndWhite = () => {
    const element = divRef.current;
    if (element) {
      const viewport = cornerstone.getViewport(element);
      if (viewport) {
        viewport.color = false;
        cornerstone.setViewport(element, viewport);
      }
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Visor DICOM</h1>
        <label htmlFor="file-upload" className="custom-file-upload">
          Subir Archivo ZIP
        </label>
        <input id="file-upload" type="file" accept=".zip" onChange={handleFileChange} />
        <button onClick={invertColors}>Invertir Colores</button>
        <button onClick={toggleBrightnessContrastControls}>Brillo / Contraste</button>
        {showBrightnessContrastControls && (
          <div className="control-panel">
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
                max="10"
                step="0.1"
                value={contrast}
                onChange={handleContrastChange}
              />
            </label>
          </div>
        )}
        <button onClick={toggleRGBControls}>RGB</button>
        {showRGBControls && (
          <div className="color-map-buttons">
            <ColorMapButton map="hotIron" />
            <ColorMapButton map="pet" />
            <ColorMapButton map="hsv" />
            <ColorMapButton map="spring" />
            <ColorMapButton map="summer" />
            <ColorMapButton map="autumn" />
            <ColorMapButton map="winter" />
            <ColorMapButton map="blues" />
            <button onClick={setToBlackAndWhite}>B/N</button>
          </div>
        )}
        <button onClick={resetValues} className="default-button">Default</button>
      </div>
      <div className="image-viewer" ref={divRef}></div>
      {images.length > 0 && (
        <div className="thumbnail-gallery">
          <button onClick={prevImage} disabled={currentImageIndex === 0}>Anterior</button>
          <button onClick={nextImage} disabled={currentImageIndex === images.length - 1}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default DicomViewer;
