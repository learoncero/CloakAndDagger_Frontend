type Props = {
  onClose: () => void;
};

export default function ChatCloseButton({ onClose }: Props) {
  return (
    <button
      className="absolute top-0 right-0 text-white text-base p-2"
      onClick={onClose}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
