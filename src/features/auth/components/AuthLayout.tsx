
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-primary">Themison</h1>
          {title && <h2 className="text-xl font-semibold text-center mt-4 mb-4">{title}</h2>}
        </div>
        {children}
      </div>
    </div>
  );
};

export { AuthLayout };
