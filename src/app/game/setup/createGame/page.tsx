"use client";

import { useRouter } from "next/navigation";
import onSubmit from "./actions";
import BackLink from "@/components/BackLink";
import CreateGameForm from "./CreateGameForm";

export default function CreateGamePage() {
  const router = useRouter();

  async function handleSubmit(state: any, data: FormData) {
    const result = await onSubmit(state, data);

    if (result.status === 200) {
      router.push("/game/setup/lobby/" + result.data?.gameCode);
      const playerId = result.data?.players[0]?.id;
      if (playerId) {
        sessionStorage.setItem('playerId', String(playerId)); //TODO: Change to cookie
      }
    }

    return result;
  }

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center">
      <div className="max-w-md text-white p-8 rounded-lg border-white border">
        <BackLink href="/game/setup">Back</BackLink>
        <h2 className="text-3xl font-bold mb-4 text-white">Game Setup</h2>
        <CreateGameForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
