import { useNavigate } from "react-router-dom";
import SimpleButton from "./SimpleButton";

const LoginModal = ({ isOpen, onClose, title = "Login Required", message = "You need to be logged in to access this feature. Sign in to your account or create a new one to continue." }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/sign-in");
    onClose();
  };

  const handleSignupRedirect = () => {
    navigate("/sign-up");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-2 border border-dark-4 rounded-lg p-6 max-w-md mx-4">
        <h3 className="h3-bold text-light-1 mb-4">{title}</h3>
        <p className="text-light-3 mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <SimpleButton
            onClick={handleLoginRedirect}
            className="flex-1"
          >
            Sign In
          </SimpleButton>
          <SimpleButton
            onClick={handleSignupRedirect}
            variant="outline"
            className="flex-1"
          >
            Sign Up
          </SimpleButton>
          <SimpleButton
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </SimpleButton>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
