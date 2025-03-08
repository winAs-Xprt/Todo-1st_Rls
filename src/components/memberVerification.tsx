import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function MemberVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate verification: if code equals 'basic12345', verification is successful.
    if (verificationCode === 'basic12345') {
      toast.success('Membership verified successfully!');
      navigate('/home');
    } else {
      toast.error('Invalid verification code. Please try again.');
    }
  };

  const handleStartForFree = () => {
    toast.success('Starting free account!');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extralight tracking-tight text-gray-900 dark:text-white">
          Verify Your Membership
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          A verification code has been sent to your email. Please enter it below to activate your Jiva Todo member account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 
                       placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md 
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Verify Account
          </button>
        </form>
        <div className="mt-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Or, start with a free account
          </p>
          <button
            onClick={handleStartForFree}
            className="mt-2 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 
                       focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
          >
            Start for Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberVerification;
