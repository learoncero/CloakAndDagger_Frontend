type Props = {
  buttonDisabled: boolean;
};

export default function CreateGameFormSubmitButton({ buttonDisabled }: Props) {
  return (
    <button
      type="submit"
      disabled={buttonDisabled} // Disable the button based on buttonDisabled state
      className={`bg-transparent border border-white ${
        !buttonDisabled ? "hover:border-black hover:bg-cyan-500" : ""
      } text-white font-bold py-2 px-4 rounded-lg mt-4`}
    >
      Create Game
    </button>
  );
}
