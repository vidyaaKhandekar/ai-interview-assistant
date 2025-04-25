
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
          <FileSearch className="h-8 w-8 text-interview-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button className="w-full">
            Return to Dashboard
          </Button>
        </Link>
        <div className="mt-4">
          <Link to="/login" className="text-sm text-interview-primary hover:underline">
            Or go back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
