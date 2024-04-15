import BackLink from "@/components/BackLink";

export default function GameOver() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="w-96 h-72 rounded-lg p-8 text-white border border-white content-center text-center">
        <h2 className="text-5xl text-red-600 font-bold mb-4">GAME OVER!</h2>
        <BackLink href={"/"}>Return to Landing Page</BackLink>
      </div>
    </div>
  );
}
