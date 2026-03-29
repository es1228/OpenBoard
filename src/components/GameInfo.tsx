import type { Event } from "../App";
import Scorecard from "./Scorecard";

type GameInfoProps = {
    game: Event;
    sportLeague: string;
};

export default function GameInfo({ game, sportLeague }: GameInfoProps) {
    return (
        <>
            <Scorecard
                event={game}
                sportLeague={sportLeague}
                handleClick={() => {}}
            />
            <div className="rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white">
                <table className="w-full border-collapse">
                    <tr>
                        <th className="text-left">Team</th>
                        {game?.competitions[0]?.competitors
                            .find((c) => c.homeAway === "away")
                            ?.linescores?.map((linescore) => (
                                <th className="w-10 text-center">
                                    {linescore.period}
                                </th>
                            ))}
                    </tr>
                    <tr>
                        <td className="text-left">
                            {
                                game?.competitions[0].competitors.find(
                                    (c) => c.homeAway === "away",
                                )?.team.abbreviation
                            }
                        </td>
                        {game?.competitions[0].competitors
                            .find((c) => c.homeAway === "away")
                            ?.linescores?.map((linescore) => (
                                <td className="text-center">
                                    {linescore.displayValue}
                                </td>
                            ))}
                    </tr>
                    <tr>
                        <td className="text-left">
                            {
                                game?.competitions[0].competitors.find(
                                    (c) => c.homeAway === "home",
                                )?.team.abbreviation
                            }
                        </td>
                        {game?.competitions[0].competitors
                            .find((c) => c.homeAway === "home")
                            ?.linescores?.map((linescore) => (
                                <td className="text-center">
                                    {linescore.displayValue}
                                </td>
                            ))}
                    </tr>
                </table>
            </div>
        </>
    );
}
