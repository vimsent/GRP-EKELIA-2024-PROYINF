
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
  const [imageHeaderInfo, setImageHeaderInfo] = useState({}); // Estado para información de la cabecera
  const imageCache = useRef({}); // Cache de imágenes

  // Activar el visor cuando el componente está montado
  useEffect(() => {
    const element = divRef.current;
    if (element) {
      cornerstone.enable(element);
      // Escuchar el evento 'wheel' con passive: false
      element.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      cornerstone.disable(element);
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Cargar imagen cuando cambia el índice
  useEffect(() => {
    if (images.length > 0) {
      loadImage(images[currentImageIndex]);
      prefetchAdjacentImages();
    }
  }, [currentImageIndex, images]);

  // Manejador de rueda del mouse para navegar entre imágenes
  const handleWheel = (event) => {
    event.preventDefault(); // Prevenir el comportamiento de desplazamiento por defecto
    if (event.deltaY > 0) {
      nextImage();
    } else {
      prevImage();
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
      .filter(Boolean); // Filtrar imágenes válidas
  };

  // Cargar imagen en el visor
  const loadImage = async (imageId) => {
    try {
      const image = imageCache.current[imageId] || await cornerstone.loadImage(imageId);
      imageCache.current[imageId] = image;
      displayImage(image);
      extractImageHeaderInfo(imageId); // Extraer información de la cabecera
    } catch (error) {
      console.error('Error cargando imagen:', error);
    }
  };

  // Extraer información de la cabecera de la imagen DICOM
  const extractImageHeaderInfo = (imageId) => {
    const image = imageCache.current[imageId];
    if (image && image.data) {
      const { data } = image; // Acceder a los datos de la imagen
      const headerInfo = {
        patientName: data.string('x00100010'), // Nombre del paciente
        patientID: data.string('x00100020'), // ID del paciente
        patientBirthDate: data.string('x00100030'), // Fecha de nacimiento del paciente
        patientSex: data.string('x00100040'), // Sexo del paciente
        studyInstanceUID: data.string('x0020000D'), // UID de la instancia del estudio
        seriesInstanceUID: data.string('x0020000E'), // UID de la instancia de la serie
        studyID: data.string('x00200010'), // ID del estudio
        referringPhysicianName: data.string('x00080090'), // Nombre del médico remitente
        studyDescription: data.string('x00081030'), // Descripción del estudio
        seriesDescription: data.string('x0008103E'), // Descripción de la serie
        imagePosition: data.string('x00200032'), // Posición de la imagen en el paciente
        imageOrientation: data.string('x00200037'), // Orientación de la imagen en el paciente
        sliceThickness: data.floatString('x00180050'), // Grosor del corte
        pixelSpacing: data.string('x00280030'), // Espaciado de píxeles
        acquisitionDate: data.string('x00080022'), // Fecha de adquisición
        acquisitionTime: data.string('x00080032'), // Hora de adquisición
        modality: data.string('x00080060'), // Modalidad
        bodyPartExamined: data.string('x00180015'), // Parte del cuerpo examinada
        manufacturer: data.string('x00080070'), // Fabricante del equipamiento
        // Agrega más campos según sea necesario
      };
      setImageHeaderInfo(headerInfo); // Actualizar el estado con la información de la cabecera
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
        // Ajustar el ancho y el centro de la VOI según el contraste y brillo
        viewport.voi.windowWidth = 256 * contrast;
        viewport.voi.windowCenter = 128 + brightness;
  
        // Aplicar la inversión
        viewport.invert = inverted;
  
        // Aplicar el viewport actualizado
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

  // Return statement should be outside the closing brace of the previous function
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
