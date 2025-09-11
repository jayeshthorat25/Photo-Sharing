// Simple validation functions to replace zod

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return null;
};

export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
};

export const validateSignup = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  if (!data.password_confirm) {
    errors.password_confirm = 'Password confirmation is required';
  } else if (data.password !== data.password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }
  
  return errors;
};

export const validateSignin = (data) => {
  const errors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateProfile = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  if (!data.bio) {
    errors.bio = 'Bio is required';
  }
  
  return errors;
};

export const validatePost = (data) => {
  const errors = {};
  
  if (!data.caption || data.caption.length < 5) {
    errors.caption = 'Caption must be at least 5 characters';
  }
  
  if (data.caption && data.caption.length > 2200) {
    errors.caption = 'Caption must be less than 2200 characters';
  }
  
  if (data.location && data.location.length > 1000) {
    errors.location = 'Location must be less than 1000 characters';
  }
  
  return errors;
};
