type Props = {
  progress: number;
};

export default function ProgressBar({ progress }: Props) {
  return (
    <div className="w-full h-4 mb-4 bg-gray-50 rounded">
      <div
        className="h-full bg-cyan-500 text-sm text-center text-white font-semibold text-align-center leading-4 rounded"
        style={{ width: `${progress}%` }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}
