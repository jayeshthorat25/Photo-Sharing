import { useCallback, useState, useRef } from "react";

import { convertFileToUrl } from "@/lib/utils";

const ProfileUploader = ({ fieldChange, mediaUrl }) => {
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

  return (
    <div onClick={handleClick}>
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
