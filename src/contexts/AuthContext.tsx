import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import dotenv from "dotenv";
import axios from "axios";
type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("interview-user");
    const email = localStorage.getItem("interview-email");

    if (name && email) {
      setUser({ name, email });
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/authenticate`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // You don't need to set the Cookie manually unless the server expects it. Skipping for now.
          withCredentials: true, // Optional: Use if server sends/reads cookies
        }
      );

      const userData = response.data;
      localStorage.setItem("interview-user", JSON.stringify(userData.name));

      localStorage.setItem("interview-email", JSON.stringify(userData.email));

      setUser(userData);
      toast.success("Successfully logged in");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to login";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // const login = async (email: string, password: string) => {
  //   setLoading(true);
  //   try {
  //     // Mock API call - would be replaced with actual API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Mock user data - would be replaced with actual API response
  //     const userData = {
  //       id: "1",
  //       name: "Demo User",
  //       email: email,
  //     };

  //     localStorage.setItem("interview-user", JSON.stringify(userData));
  //     setUser(userData);
  //     toast.success("Successfully logged in");
  //   } catch (error) {
  //     toast.error("Failed to login");
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        {
          name,
          email,
          password,
          role: "admin", // Static for now, make dynamic if needed
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // const userData = response.data;
      // localStorage.setItem("interview-user", JSON.stringify(userData));
      // setUser(userData);
      toast.success("Successfully registered");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to register";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("interview-user");
    localStorage.removeItem("interview-email");
    setUser(null);
    toast.success("Successfully logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
