import { useCallback, useState, useRef } from "react";

import SimpleButton from "@/components/SimpleButton";
import { convertFileToUrl } from "@/lib/utils";

const FileUploader = ({ fieldChange, mediaUrl }) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((selectedFiles) => {
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      fieldChange(filesArray);
      setFileUrl(convertFileToUrl(filesArray[0]));
    }
  }, [fieldChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <SimpleButton type="button" variant="secondary">
            Select from computer
          </SimpleButton>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
