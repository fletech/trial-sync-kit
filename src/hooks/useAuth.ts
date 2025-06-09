import { useState, useEffect } from "react";
import { isUserLoggedIn, initAuthListener } from "@/services/userService";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth listener
    initAuthListener();

    // Check initial auth state
    const checkAuth = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("userDataUpdated", handleAuthChange);

    return () => {
      window.removeEventListener("userDataUpdated", handleAuthChange);
    };
  }, []);

  return { isLoggedIn, isLoading };
};
