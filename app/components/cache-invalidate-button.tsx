'use client';

import { useState } from 'react';

export default function CacheInvalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvalidate = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/cache/invalidate', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Cache invalidated successfully! Refresh the page to see changes.');
      } else {
        setMessage('❌ Failed to invalidate cache. Please try again.');
      }
    } catch (error) {
      setMessage('❌ Error invalidating cache. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleInvalidate}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {isLoading ? 'Invalidating...' : 'Invalidate Cache'}
      </button>
      {message && (
        <p className="mt-2 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
} 