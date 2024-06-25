export default function ManualImpostorContent() {
  return (
    <div>
      <p className="mb-4">
        As an Impostor, your objective is to eliminate Crewmates and sabotage
        the ship without being caught.
      </p>
      <h2 className="font-semibold underline mb-2">Instructions</h2>
      <ul className="list-disc list-inside">
        <li>Blend in with the Crewmates.</li>
        <li>Sabotage vital systems to cause chaos.</li>
        <li>Eliminate Crewmates without getting caught.</li>
      </ul>
      <h2 className="font-semibold underline mb-2 mt-4">Shortcuts</h2>
      <ul className="list-disc list-inside">
        <li>Move: W A S D</li>
        <li>Show Minimap: M / Q</li>
        <li>Show Manual: H</li>
        <li>Kill: E</li>
        <li>Cancel Sabotage: C</li>
        <li>Report Dead Body: R</li>
        <li>Call an emergency meeting: F</li>
        <li>Use Vents: V</li>
      </ul>
    </div>
  );
}
