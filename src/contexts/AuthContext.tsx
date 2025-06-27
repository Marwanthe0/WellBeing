import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wellbeing_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in production, this would be a real API
    const users = JSON.parse(localStorage.getItem('wellbeing_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userObj = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userObj);
      localStorage.setItem('wellbeing_user', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call - in production, this would be a real API with password hashing
    const users = JSON.parse(localStorage.getItem('wellbeing_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // In production, this would be hashed
    };

    users.push(newUser);
    localStorage.setItem('wellbeing_users', JSON.stringify(users));

    const userObj = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userObj);
    localStorage.setItem('wellbeing_user', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wellbeing_user');
  };

  const value = {
    user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}