export default function ManualCrewmateContent() {
  return (
    <div>
      <p className="mb-4">
        As a Crewmate, your objective is to complete tasks and identify the
        impostors among the crew.
      </p>
      <h2 className="font-semibold underline mb-2">Instructions</h2>
      <ul className="list-disc list-inside">
        <li>Work with your crewmates to complete tasks.</li>
        <li>Identify the Impostors and vote them out.</li>
        <li>Stay alert and report any suspicious behavior.</li>
      </ul>
      <h2 className="font-semibold underline mb-2 mt-4">Shortcuts</h2>
      <ul className="list-disc list-inside">
        <li>Move: W A S D</li>
        <li>Show Minimap: M / Q</li>
        <li>Show Manual: H</li>
        <li>Start/Cancel Task: E</li>
        <li>Cancel Sabotage: C</li>
        <li>Report Dead Body: R</li>
        <li>Call an emergency meeting: F</li>
      </ul>
    </div>
  );
}
