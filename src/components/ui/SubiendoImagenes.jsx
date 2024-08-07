import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { Container } from 'reactstrap';
import '../../css/SubiendoImagenes.css';

const SubiendoImagenes = forwardRef(({ NuevoEstilos = false, requerido = false, imagenes = [] }, ref) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (imagenes.length > 0) {
      const mappedImages = imagenes.map(img => ({
        ...img,
        isUploaded: true // Marca las imágenes como subidas
      }));
      setFiles(mappedImages);
    }
  }, [imagenes]);

  const handleDrop = (acceptedFiles) => {
    const allowedExtensions = ['.png', '.jpeg', '.jpg', '.gif'];
    const filteredFiles = acceptedFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });

    if (filteredFiles.length !== acceptedFiles.length) {
      setError('Solo se permiten archivos con extensiones .png, .jpeg, .jpg o .gif');
    } else {
      setFiles([...files, ...filteredFiles]);
      setError('');
    }
  };

  const removeFile = (e, fileToRemove) => {
    e.preventDefault();
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Expose functions to parent components
  useImperativeHandle(ref, () => ({
    getFiles: () => files,
    clearFiles: () => setFiles([]), // Function to clear files
    hasFiles: () => files.length > 0 // Function to check if there are files
  }));

  const message = NuevoEstilos
    ? 'Coloca tus evidencias aquí, o haz clic para seleccionar'
    : 'Suba sus evidencias aquí';

  return (
    <div>
      <Container style={{ textAlign: 'center', color: 'black' }}>
        <h1 className='text-center text-base font-medium mb-1'>{message}</h1>
        {error && <div className="error-message">{error}</div>}

        {!imagenes.length && (
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <span>📁</span>
                  <p className='text-sm font-medium mb-1'>{message}</p>
                </div>
              </section>
            )}
          </Dropzone>
        )}
        <div className="image-preview-container">
          {files.length === 0 ? <h3 className='font-medium'>No hay imágenes(evidencias)</h3> : files.map((file, index) => (
            <div key={index} className="image-container">
              <img alt='Imagen' className="preview-image" src={URL.createObjectURL(file)} />
              <button onClick={(e) => removeFile(e, file)} className="remove-button">&times;</button>
            </div>
          ))}
        </div>
          </Container>
    </div>
  );
});

export default SubiendoImagenes;
