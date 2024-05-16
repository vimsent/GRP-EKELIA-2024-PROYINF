import React, { useState } from 'react';
import DicomViewer from './DicomViewer';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" onChange={handleFileChange} />
        {selectedFile && <DicomViewer file={selectedFile} />}
        <p>
          Ekelia
        </p>
      </header>
    </div>
  );
}

export default App;
