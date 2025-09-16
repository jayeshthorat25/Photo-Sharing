const PrivacyMessage = ({ 
  type = "profile", // "profile" or "post"
  username = "",
  isOwner = false 
}) => {
  const getMessage = () => {
    if (type === "profile") {
      if (isOwner) {
        return "Your profile is set to private. Only you can see your posts.";
      }
      return `${username} has set their profile to private. You can only see posts they share directly.`;
    } else {
      if (isOwner) {
        return "This post is private. Only you can see it.";
      }
      return "This post is private and can only be viewed by the author.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
        <img
          src="/assets/icons/eye-slash.svg"
          alt="Private"
          className="w-8 h-8 text-gray-400"
        />
      </div>
      <h3 className="text-lg font-semibold text-light-1 mb-2">
        {type === "profile" ? "Private Profile" : "Private Post"}
      </h3>
      <p className="text-light-3 max-w-md">
        {getMessage()}
      </p>
      {type === "profile" && !isOwner && (
        <p className="text-sm text-light-4 mt-2">
          You can still see posts that {username} shares directly with you.
        </p>
      )}
    </div>
  );
};

export default PrivacyMessage;
