import SimpleButton from "./SimpleButton";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default" // "default", "danger"
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-2 border border-dark-4 rounded-lg p-6 max-w-md mx-4">
        <h3 className="h3-bold text-light-1 mb-4">{title}</h3>
        <p className="text-light-3 mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <SimpleButton
            onClick={handleConfirm}
            className={`flex-1 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            {confirmText}
          </SimpleButton>
          <SimpleButton
            onClick={onClose}
            variant="ghost"
            className="flex-1"
          >
            {cancelText}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
