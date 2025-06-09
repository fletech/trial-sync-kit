import {
  signUp,
  signIn,
  resetPassword,
  logout,
  isUserLoggedIn,
  initAuthListener,
} from "../services/userService";

// Example: Sign Up
export const handleSignUp = async (
  email: string,
  password: string,
  name?: string
) => {
  try {
    const result = await signUp(email, password, name);

    if (result.error) {
      console.error("Sign up error:", result.error.message);
      return { success: false, error: result.error.message };
    }

    console.log("User signed up successfully:", result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Example: Sign In
export const handleSignIn = async (
  email: string,
  password: string,
  rememberMe: boolean = false
) => {
  try {
    const result = await signIn(email, password, rememberMe);

    if (result.error) {
      console.error("Sign in error:", result.error.message);
      return { success: false, error: result.error.message };
    }

    console.log("User signed in successfully:", result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Example: Forgot Password
export const handleForgotPassword = async (email: string) => {
  try {
    const result = await resetPassword(email);

    if (result.error) {
      console.error("Reset password error:", result.error.message);
      return { success: false, error: result.error.message };
    }

    console.log("Password reset email sent");
    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Example: Logout
export const handleLogout = async () => {
  try {
    await logout();
    console.log("User logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Failed to logout" };
  }
};

// Example: Check if user is logged in (useful for protected routes)
export const checkAuth = async () => {
  try {
    const isLoggedIn = await isUserLoggedIn();
    return isLoggedIn;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

// Initialize auth listener (call this in your App.tsx or main.tsx)
export const setupAuthListener = () => {
  initAuthListener();
  console.log("Auth listener initialized");
};

// Example usage in a React component:
/*
import React, { useState } from 'react';
import { handleSignIn, handleSignUp, handleForgotPassword } from './authExamples';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const result = await handleSignUp(email, password);
      if (result.success) {
        // Handle successful sign up
        alert('Sign up successful!');
      } else {
        // Handle error
        alert(result.error);
      }
    } else {
      const result = await handleSignIn(email, password);
      if (result.success) {
        // Handle successful sign in
        alert('Sign in successful!');
      } else {
        // Handle error
        alert(result.error);
      }
    }
  };

  const handleForgot = async () => {
    if (!email) {
      alert('Please enter your email first');
      return;
    }
    
    const result = await handleForgotPassword(email);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      <button type="button" onClick={handleForgot}>
        Forgot Password?
      </button>
    </form>
  );
};
*/
