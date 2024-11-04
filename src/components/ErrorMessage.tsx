import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
};