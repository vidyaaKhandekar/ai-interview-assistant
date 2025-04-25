
import React from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-interview-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-interview-primary">{title}</h2>
        <div className="flex justify-center mt-2">
          <div className="h-1 w-16 bg-interview-secondary rounded"></div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          AI Powered Interview Assistant © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
