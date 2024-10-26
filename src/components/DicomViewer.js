import React, { useRef, useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import JSZip from 'jszip';
import './styles.css';

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
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageHeaderInfo, setImageHeaderInfo] = useState({});
  const imageCache = useRef({});

  // Nuevo estado para el arrastre
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  // Activar el visor cuando el componente está montado
   useEffect(() => {
    const element = divRef.current;
    if (element) {
      cornerstone.enable(element);
      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      cornerstone.disable(element);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cargar imagen cuando cambia el índice
  useEffect(() => {
    if (images.length > 0) {
      loadImage(images[currentImageIndex]);
      prefetchAdjacentImages();
    }
  }, [currentImageIndex, images]);

  // Manejador de rueda del mouse para hacer zoom
  const handleWheel = (event) => {
    event.preventDefault(); // Prevenir el comportamiento de desplazamiento por defecto
    const element = divRef.current;
    if (element) {
      const viewport = cornerstone.getViewport(element);
      const scaleChange = event.deltaY > 0 ? 0.9 : 1.1; // Cambia el zoom, ajusta según lo necesites
      viewport.scale *= scaleChange; // Ajustar el zoom
      cornerstone.setViewport(element, viewport);
    }
  };
  
  // Manejador para el inicio del arrastre
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartPoint({ x: event.clientX, y: event.clientY });
  };

  // Manejador para la finalización del arrastre
  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPoint(null);
  };

  // Manejador para el movimiento del mouse
  const handleMouseMove = (event) => {
    if (isDragging && startPoint) {
      const element = divRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        const dx = event.clientX - startPoint.x;
        const dy = event.clientY - startPoint.y;
        viewport.translation.x += dx;
        viewport.translation.y += dy;
        cornerstone.setViewport(element, viewport);
        setStartPoint({ x: event.clientX, y: event.clientY }); // Actualizar el punto de inicio
      }
    }
  };

  // Precargar imágenes adyacentes
  const prefetchAdjacentImages = () => {
    prefetchImage(currentImageIndex + 1);
    prefetchImage(currentImageIndex - 1);
  };

  const prefetchImage = (index) => {
    if (index >= 0 && index < images.length) {
      const imageId = images[index];
      if (!imageCache.current[imageId]) {
        cornerstone.loadImage(imageId)
          .then((image) => (imageCache.current[imageId] = image))
          .catch((error) => console.error('Error precargando imagen:', error));
      }
    }
  };

  // Manejador para carga de archivos ZIP
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const validImages = await processZipFile(file);
        setImages(validImages);
        if (validImages.length > 0) loadImage(validImages[0]);
      } catch (error) {
        console.error('Error al procesar el archivo ZIP:', error);
      }
    }
  };
  
  // Procesar archivo ZIP y extraer imágenes DICOM válidas
  const processZipFile = async (file) => {
    const zip = new JSZip();
    const zipContent = await file.arrayBuffer();
    const zipFile = await zip.loadAsync(zipContent);

    const imageEntries = Object.values(zipFile.files)
      .filter((entry) => entry.name.endsWith('.dcm'))
      .sort((a, b) => a.name.localeCompare(b.name));

    const imagePromises = imageEntries.map((entry) => entry.async('arraybuffer'));
    const imageBuffers = await Promise.all(imagePromises);

    return imageBuffers
      .map((buffer, index) => {
        try {
          const blob = new Blob([buffer], { type: 'application/dicom' });
          return cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);
        } catch (error) {
          console.warn('No es una imagen DICOM válida:', index, error);
          return null;
        }
      })
      .filter(Boolean);
  };

  // Cargar imagen en el visor
  const loadImage = async (imageId) => {
    try {
      const image = imageCache.current[imageId] || await cornerstone.loadImage(imageId);
      imageCache.current[imageId] = image;
      displayImage(image);
      extractImageHeaderInfo(imageId);
    } catch (error) {
      console.error('Error cargando imagen:', error);
    }
  };

  // Extraer información de la cabecera de la imagen DICOM
  const extractImageHeaderInfo = (imageId) => {
    const image = imageCache.current[imageId];
    if (image && image.data) {
      const { data } = image;
      const headerInfo = {
        patientName: data.string('x00100010'),
        patientID: data.string('x00100020'),
        patientBirthDate: data.string('x00100030'),
        patientSex: data.string('x00100040'),
        studyInstanceUID: data.string('x0020000D'),
        seriesInstanceUID: data.string('x0020000E'),
        studyID: data.string('x00200010'),
        referringPhysicianName: data.string('x00080090'),
        studyDescription: data.string('x00081030'),
        seriesDescription: data.string('x0008103E'),
        imagePosition: data.string('x00200032'),
        imageOrientation: data.string('x00200037'),
        sliceThickness: data.floatString('x00180050'),
        pixelSpacing: data.string('x00280030'),
        acquisitionDate: data.string('x00080022'),
        acquisitionTime: data.string('x00080032'),
        modality: data.string('x00080060'),
        bodyPartExamined: data.string('x00180015'),
        manufacturer: data.string('x00080070'),
      };
      setImageHeaderInfo(headerInfo);
    }
  };

  // Mostrar imagen en el visor
  const displayImage = (image) => {
    const element = divRef.current;
    if (element) {
      if (image?.width && image?.height) {
        cornerstone.displayImage(element, image);
        updateViewport();
      } else {
        console.error('Imagen inválida:', image);
      }
    }
  };

  // Navegación entre imágenes
  const nextImage = () => setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
  const prevImage = () => setCurrentImageIndex((prev) => Math.max(prev - 1, 0));

  // Controles de brillo, contraste e inversión
  const invertColors = () => {
    setInverted((prev) => !prev);
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

  const handleBrightnessChange = (event) => {
    setBrightness(parseInt(event.target.value, 10));
    updateViewport();
  };

  const handleContrastChange = (event) => {
    setContrast(parseFloat(event.target.value));
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

  // Alternar visibilidad de controles
  const toggleBrightnessContrastControls = () => setShowBrightnessContrastControls((prev) => !prev);

  // Calcular la posición de la barra de progreso
  const progressBarHeight = '20px'; // Alto fijo
  const progressBarTop = `${(currentImageIndex / (images.length - 1)) * 100}%`; // Cambia a 100% basado en el índice

  // Manejador para la barra de progreso
  const handleProgressChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    setCurrentImageIndex(newIndex);
  };

  const resetValues = () => {
    setBrightness(0);
    setContrast(1);
    setInverted(false);
    updateViewport();
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
        <button onClick={resetValues} className="default-button">Default</button>
      </div>
      <div
        className="viewport"
        ref={divRef}
        style={{  overflow: 'hidden',width: '100%', height: '80vh', position: 'relative' }}
        tabIndex={0}
      >
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ height: progressBarHeight, top: progressBarTop }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={images.length - 1}
          value={currentImageIndex}
          onChange={handleProgressChange}
          style={{ width: '100%' }}
        />
        
      </div>
      <div className="image-header-info" style={{ color: '#fff' }}>
      <h2>Información de la Cabecera:</h2>
        <ul>
          <li>Nombre del Paciente: {imageHeaderInfo.patientName || 'N/A'}</li>
          <li>ID del Paciente: {imageHeaderInfo.patientID || 'N/A'}</li>
          <li>Fecha de Nacimiento: {imageHeaderInfo.patientBirthDate || 'N/A'}</li>
          <li>Sexo del Paciente: {imageHeaderInfo.patientSex || 'N/A'}</li>
          <li>UID del Estudio: {imageHeaderInfo.studyInstanceUID || 'N/A'}</li>
          <li>UID de la Serie: {imageHeaderInfo.seriesInstanceUID || 'N/A'}</li>
          <li>ID del Estudio: {imageHeaderInfo.studyID || 'N/A'}</li>
          <li>Nombre del Médico Remitente: {imageHeaderInfo.referringPhysicianName || 'N/A'}</li>
          <li>Descripción del Estudio: {imageHeaderInfo.studyDescription || 'N/A'}</li>
          <li>Descripción de la Serie: {imageHeaderInfo.seriesDescription || 'N/A'}</li>
          <li>Posición de la Imagen: {imageHeaderInfo.imagePosition || 'N/A'}</li>
          <li>Orientación de la Imagen: {imageHeaderInfo.imageOrientation || 'N/A'}</li>
          <li>Grosor del Corte: {imageHeaderInfo.sliceThickness || 'N/A'}</li>
          <li>Espaciado de Píxeles: {imageHeaderInfo.pixelSpacing || 'N/A'}</li>
          <li>Fecha de Adquisición: {imageHeaderInfo.acquisitionDate || 'N/A'}</li>
          <li>Hora de Adquisición: {imageHeaderInfo.acquisitionTime || 'N/A'}</li>
          <li>Modalidad: {imageHeaderInfo.modality || 'N/A'}</li>
          <li>Parte del Cuerpo Examinada: {imageHeaderInfo.bodyPartExamined || 'N/A'}</li>
          <li>Fabricante: {imageHeaderInfo.manufacturer || 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
  
};

export default DicomViewer;
