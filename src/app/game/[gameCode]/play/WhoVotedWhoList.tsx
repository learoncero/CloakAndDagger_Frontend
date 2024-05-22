import {Player, VoteEvent} from "@/app/types";

type WhoVotedWhoProps = {
    players: Player[];
  voteEvents: VoteEvent[];
};


export default function WhoVotedWhoList({ players, voteEvents}: WhoVotedWhoProps) {

    type VotesDict = {
        [key: string]: string[];
    };
    //creates a Dictionary of type VotesDict, which groups players by who they voted for
    const votesDict: VotesDict = voteEvents.reduce((acc: VotesDict, vote: VoteEvent) => {
        const votedForUsername = players.find(player => player.id === vote.votedForPlayer)?.username;
        const votedByUsername = players.find(player => player.id === vote.votedBy)?.username;

        if (votedForUsername && votedByUsername) {
            if (!acc[votedForUsername]) {
                acc[votedForUsername] = [];
            }
            acc[votedForUsername].push(votedByUsername);
        }
        return acc;
    }, {} as VotesDict);

    return (
        <div className={"mt-1"}>
            {Object.keys(votesDict).map((votedForUsername, index) => (
                <div className={"mb-1"} key={index}>
                    <strong>{votedForUsername}:</strong> {votesDict[votedForUsername].join(', ')}
                </div>
            ))}
        </div>
    );
}