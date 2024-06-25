type Props = {
  role?: string;
};

export default function ManualHeading({ role }: Props) {
  return (
    <div className="flex justify-center">
      <h2 className="text-5xl text-cyan-500 font-bold text-center mb-10">
        {role === "CREWMATE" || role === "CREWMATE_GHOST"
          ? "CREWMATE "
          : role === "IMPOSTOR" || role === "IMPOSTOR_GHOST"
          ? "IMPOSTOR "
          : null}
        MANUAL
      </h2>
    </div>
  );
}
