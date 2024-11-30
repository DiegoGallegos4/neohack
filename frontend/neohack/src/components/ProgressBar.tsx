interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      >
        {showPercentage && (
          <span className="absolute text-xs text-white ml-1">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
