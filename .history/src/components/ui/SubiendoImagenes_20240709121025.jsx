import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import { Container } from 'reactstrap';
import '../../css/SubiendoImagenes.css';

const SubiendoImagenes = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleDrop = (acceptedFiles) => {
    const allowedExtensions = ['.png', '.jpeg', '.jpg', '.gif'];
    const filteredFiles = acceptedFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });

    if (filteredFiles.length !== acceptedFiles.length) {
      setError('Solo se permiten archivos con extensiones .png, .jpeg, .jpg o .gif');
    } else {
      setError('');
      
      // Construir el array de objetos para cada archivo seleccionado
      const filesInfo = filteredFiles.map(file => ({
        Key: 'imagen',
        type: 'File',
        Value: file.path // Asumiendo que `file.path` es la ruta del archivo local
      }));

      // Actualizar el estado con la información de los archivos seleccionados
      setFiles([...files, ...filesInfo]);
    }
  };

  const removeFile = (e, fileToRemove) => {
    e.preventDefault();
    setFiles(files.filter(file => file.Value !== fileToRemove.Value));
  };

  useImperativeHandle(ref, () => ({
    getFiles: () => files,
  }));

  return (
    <div>
      <Container style={{ textAlign: 'center', color: 'black' }}>
        <h1 className='text-center'>Sube tus imágenes aquí</h1>
        {error && <div className="error-message">{error}</div>}
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <span>📁</span>
                <p>Coloca tus imágenes aquí, o haz clic para seleccionar</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div className="image-preview-container">
          {files.length === 0 ? <h3>No hay imágenes</h3> : files.map((file, index) => (
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
