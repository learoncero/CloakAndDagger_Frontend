type Props = {
  isJoinDisabled: boolean;
};

export default function JoinGameFormSubmitButton({ isJoinDisabled }: Props) {
  return (
  <button
      className={`bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center w-full ${
      !isJoinDisabled
          ? "hover:border-black hover:bg-cyan-500"
          : "cursor-default"
      }`}
      type="submit"
      disabled={isJoinDisabled}
  >
    JOIN GAME
  </button>
  );
}
