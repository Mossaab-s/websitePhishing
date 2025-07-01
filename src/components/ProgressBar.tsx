import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabels?: boolean;
}

export default function ProgressBar({ current, total, showLabels = true }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progression
          </span>
          <span className="text-sm text-gray-500">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}