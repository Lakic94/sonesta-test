'use client';

import { useState, useEffect } from 'react';

interface CacheStatusIndicatorProps {
  pageGeneratedAt: string;
  contentUpdatedAt: string;
  entryRevision: number;
}

export default function CacheStatusIndicator({
  pageGeneratedAt,
  contentUpdatedAt,
  entryRevision
}: CacheStatusIndicatorProps) {
  const [isCacheStale, setIsCacheStale] = useState(false);
  const [timeSinceGeneration, setTimeSinceGeneration] = useState('');
  
  useEffect(() => {
    const pageDate = new Date(pageGeneratedAt);
    const contentDate = new Date(contentUpdatedAt);
    
    // Check if content is newer than the page generation
    setIsCacheStale(contentDate > pageDate);
    
    // Update time since generation every second
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - pageDate.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeSinceGeneration(`${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < 3600) {
        setTimeSinceGeneration(`${Math.floor(diffInSeconds / 60)} minutes ago`);
      } else {
        setTimeSinceGeneration(`${Math.floor(diffInSeconds / 3600)} hours ago`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [pageGeneratedAt, contentUpdatedAt]);
  
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isCacheStale ? 'bg-red-500' : 'bg-green-500'
        }`} />
        <span className="text-sm font-medium">
          {isCacheStale ? 'Cache Stale' : 'Cache Fresh'}
        </span>
      </div>
      
      <div className="text-sm text-gray-600">
        Generated {timeSinceGeneration}
      </div>
      
      <div className="text-sm text-gray-600">
        Revision #{entryRevision}
      </div>
    </div>
  );
} 