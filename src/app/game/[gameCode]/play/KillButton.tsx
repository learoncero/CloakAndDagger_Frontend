type Props = {
  handleKill(): void;
  isPlayerNearby: boolean;
  isTimer: boolean;
};

export default function KillButton({ handleKill, isPlayerNearby , isTimer}: Props) {
  const buttonclickable = isPlayerNearby && !isTimer;
  return (
    <button
      className={`text-black px-4 py-2 rounded-md ${!buttonclickable ? 'cursor-default bg-gray-500' : 'cursor-pointer bg-red-500'}`}
      onClick={handleKill}
      disabled={!buttonclickable}
    >
      Simulate Kill
    </button>
  );
}
