import type { Game } from "../App";
import Scorecard from "./Scorecard";
import { useEffect, useState } from "react";

type GameInfoProps = {
    game: Game;
    sportLeague: string;
};

type winprobability = {
    homeWinPercentage: number;
};

export default function GameInfo({ game, sportLeague }: GameInfoProps) {
    const [winProbability, setWinProbability] = useState<winprobability[]>([]);
    useEffect(() => {
        const fetchWinProbability = async () => {
            const response = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/summary?event=${game.id}`,
            );
            const data = await response.json();
            console.log(data);
            setWinProbability(data.winprobability);
        };
        fetchWinProbability();
    }, [game]);

    const homeWinPercentage =
        Math.round(
            winProbability?.[winProbability.length - 1]?.homeWinPercentage *
                100,
        ) ?? 50;
    const awayWinPercentage = 100 - homeWinPercentage;

    const awayTeam = game?.competitions[0]?.competitors.find(
        (c) => c.homeAway === "away",
    );

    const homeTeam = game?.competitions[0]?.competitors.find(
        (c) => c.homeAway === "home",
    );

    return (
        <>
            <Scorecard
                game={game}
                sportLeague={sportLeague}
                handleClick={() => {}}
            />
            <div className="rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white">
                <p>Box Score</p>
                <table className="mt-2 w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left">Team</th>
                            {awayTeam?.linescores?.map((linescore) => (
                                <th className="w-10 text-center">
                                    {linescore.period}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left">
                                {awayTeam?.team.abbreviation}
                            </td>
                            {awayTeam?.linescores?.map((linescore) => (
                                <td className="text-center">
                                    {linescore.displayValue}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="text-left">
                                {homeTeam?.team.abbreviation}
                            </td>
                            {homeTeam?.linescores?.map((linescore) => (
                                <td className="text-center">
                                    {linescore.displayValue}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                className={`rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white ${Number.isNaN(homeWinPercentage) && "hidden"} ${game.competitions[0].status?.type.name !== "STATUS_IN_PROGRESS" && "hidden"}`}
            >
                <h1>Win Probability</h1>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <div>
                        <p>{awayTeam?.team.abbreviation}</p>
                        <p>{awayWinPercentage}%</p>
                    </div>
                    <div className="flex h-2 w-full rounded-3xl">
                        <div
                            className={`${awayWinPercentage === 100 ? "rounded-3xl" : "rounded-l-3xl"}`}
                            style={{
                                width: `${awayWinPercentage}%`,
                                backgroundColor: `#${
                                    game.competitions[0].competitors.find(
                                        (c) => c.homeAway === "away",
                                    )?.team.color
                                }`,
                            }}
                        ></div>
                        <div
                            className={`${homeWinPercentage === 100 ? "rounded-3xl" : "rounded-r-3xl"}`}
                            style={{
                                width: `${homeWinPercentage}%`,
                                backgroundColor: `#${
                                    game.competitions[0].competitors.find(
                                        (c) => c.homeAway === "home",
                                    )?.team.color
                                }`,
                            }}
                        ></div>
                    </div>
                    <div>
                        <p>{homeTeam?.team.abbreviation}</p>
                        <p>{homeWinPercentage}%</p>
                    </div>
                </div>
            </div>
            <p className="text-black dark:text-white">
                Venue:{" "}
                {`${game?.competitions[0].venue.fullName}, ${game?.competitions[0].venue.address.city}`}
            </p>
        </>
    );
}
