import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import React, { useState, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';

const DicomViewer = ({ file }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const loadDicomImage = () => {
      const fileReader = new FileReader();
      fileReader.onload = function() {
        const byteArray = new Uint8Array(this.result);
        const dataSet = dicomParser.parseDicom(byteArray);
        const pixelDataElement = dataSet.elements.x7fe00010;
        const pixelData = new Uint8Array(this.result, pixelDataElement.dataOffset);
        const image = {
          imageId: file.name,
          columns: dataSet.uint16('x00280011'),
          rows: dataSet.uint16('x00280010'),
          color: false,
          columnPixelSpacing: dataSet.floatString('x00280030'),
          rowPixelSpacing: dataSet.floatString('x0028003F'),
          slope: dataSet.floatString('x00281053'),
          intercept: dataSet.floatString('x00281052'),
          minPixelValue: 0,
          maxPixelValue: 255,
          render: cornerstone.renderGrayscaleImage,
          getPixelData: () => pixelData
        };

        try {
          const element = document.getElementById('dicom-canvas');
          cornerstone.enable(element);
          cornerstone.addLayer(element, image);
          cornerstone.displayImage(element, image);
          setImageLoaded(true);
          setImageData(dataSet);
          console.log('Imagen DICOM cargada correctamente:', dataSet);
        } catch (error) {
          console.error('Error al cargar la imagen DICOM:', error);
        }
      };
      fileReader.readAsArrayBuffer(file);
    };

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // Configuraciones de cornerstoneWADOImageLoader...

    loadDicomImage();

    return () => {
      const element = document.getElementById('dicom-canvas');
      cornerstone.disable(element);
    };
  }, [file]);

  return (
    <div>
      {imageLoaded ? (
        <div>
          <canvas id="dicom-canvas" />
          {imageData && (
            <div>
              <h3>Datos de la imagen DICOM:</h3>
              <pre>{JSON.stringify(imageData, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando imagen DICOM...</p>
      )}
    </div>
  );
};

export default DicomViewer;
