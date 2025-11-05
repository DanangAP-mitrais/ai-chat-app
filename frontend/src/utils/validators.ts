export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: "Password must be at least 8 characters long" 
    }
  }

  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: "Password must contain at least one uppercase letter" 
    }
  }

  if (!/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: "Password must contain at least one lowercase letter" 
    }
  }

  if (!/\d/.test(password)) {
    return { 
      isValid: false, 
      message: "Password must contain at least one number" 
    }
  }

  if (!/[@$!%*?&]/.test(password)) {
    return { 
      isValid: false, 
      message: "Password must contain at least one special character (@$!%*?&)" 
    }
  }

  return { 
    isValid: true, 
    message: "Password is valid" 
  }
}

export const validateFullName = (fullname: string): { isValid: boolean; message: string } => {
  if (fullname.length < 2) {
    return { 
      isValid: false, 
      message: "Full name must be at least 2 characters long" 
    }
  }

  if (fullname.length > 255) {
    return { 
      isValid: false, 
      message: "Full name must not exceed 255 characters" 
    }
  }

  return { 
    isValid: true, 
    message: "Full name is valid" 
  }
}