type Props = {
  handleKill(): void;
  disabled: boolean;
};

export default function KillButton({ handleKill, disabled }: Props) {
  return (
    <button
      className="bg-red-500 text-black px-4 py-2 rounded-md"
      onClick={handleKill}
      disabled={disabled}
    >
      Simulate Kill
    </button>
  );
}
