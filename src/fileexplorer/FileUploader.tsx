import React, { useState } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setUploadedFiles([selectedFile]);
      onFileSelected(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".ant" onChange={handleFileChange} />
      {uploadedFiles.map((file, index) => (
        <button key={index} onClick={() => onFileSelected(file)}>
          {file.name}
        </button>
      ))}
    </div>
  );
};

export default FileUploader;
