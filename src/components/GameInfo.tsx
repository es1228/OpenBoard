import { type Summary, type Game } from "../App";
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
    const [gameSummary, setGameSummary] = useState<Summary>();

    useEffect(() => {
        const fetchWinProbability = async () => {
            if (sportLeague !== "hockey/nhl") {
                try {
                    const response = await fetch(
                        `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/summary?event=${game.id}`,
                    );
                    const data = await response.json();
                    console.log(data);
                    setWinProbability(data.winprobability);
                } catch {
                    console.error("Could not fetch win probabilities");
                }
            }
        };
        fetchWinProbability();
    }, [game]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(
                    `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/summary?event=${game.id}`,
                );
                const data = await response.json();
                setGameSummary(data);
            } catch {
                console.error("Could not fetch game summary");
            }
        };
        fetchSummary();
    }, [sportLeague, game.id]);

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

    const periodFormatter = (
        sport: string,
        period: number,
        seasonType: number,
    ) => {
        if (sport === "hockey/nhl" && period === 4) return "OT";
        else if (sport === "hockey/nhl" && period === 5 && seasonType !== 3)
            return "SO";
        else if (sport === "hockey/nhl" && period > 4 && seasonType === 3)
            return `OT${period - 3}`;
        else if (
            (sport === "basketball/nba" || sport === "football/nfl") &&
            period === 5
        )
            return "OT";
        else if (
            (sport === "basketball/nba" || sport === "football/nfl") &&
            period > 5
        )
            return `OT${period - 4}`;
        else return period;
    };

    return (
        <>
            <Scorecard
                game={game}
                sportLeague={sportLeague}
                handleClick={() => {}}
            />
            <div className="rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white">
                <h1 className="font-bold">Line Score</h1>
                <table className="mt-2 w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left">Team</th>
                            {awayTeam?.linescores?.map((linescore) => (
                                <th className="w-10 text-center">
                                    {periodFormatter(
                                        sportLeague,
                                        linescore.period,
                                        game.season.type,
                                    )}
                                </th>
                            ))}
                            <th className="w-10 text-center">
                                {homeTeam?.statistics.find(
                                    (s) =>
                                        s.name === "runs" ||
                                        s.name === "goals" ||
                                        s.name === "points",
                                )?.abbreviation ?? "T"}
                            </th>
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
                            <td className="text-center font-bold">
                                {(awayTeam?.statistics.find(
                                    (s) =>
                                        s.name === "runs" ||
                                        s.name === "goals" ||
                                        s.name === "points",
                                )?.displayValue ??
                                typeof awayTeam?.score === "object")
                                    ? awayTeam?.score?.displayValue
                                    : awayTeam?.score}
                            </td>
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
                            {homeTeam?.linescores?.length! <
                                awayTeam?.linescores?.length! && (
                                <td className="text-center">-</td>
                            )}
                            <td className="text-center font-bold">
                                {(homeTeam?.statistics.find(
                                    (s) =>
                                        s.name === "runs" ||
                                        s.name === "goals" ||
                                        s.name === "points",
                                )?.displayValue ??
                                typeof homeTeam?.score === "object")
                                    ? homeTeam?.score?.displayValue
                                    : homeTeam?.score}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                className={`rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white ${Number.isNaN(homeWinPercentage) && "hidden"} ${game.competitions[0].status?.type.name !== "STATUS_IN_PROGRESS" && "hidden"}`}
            >
                <h1 className="font-bold">Win Probability</h1>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <div>
                        <p>{awayTeam?.team.abbreviation}</p>
                        <p>{awayWinPercentage}%</p>
                    </div>
                    <div className="flex h-2 w-full gap-0.5 rounded-3xl">
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
            {gameSummary?.boxscore.players &&
                gameSummary?.boxscore.players.map((player) => (
                    <div className="flex flex-col gap-2 rounded-3xl bg-neutral-400/20 p-4 text-black dark:bg-neutral-800/40 dark:text-white">
                        <h1 className="font-bold">{player.team.displayName}</h1>
                        <div className="overflow-x-auto">
                            <table className="w-max min-w-full tabular-nums">
                                {player.statistics.map((stat) => (
                                    <>
                                        <thead>
                                            <tr>
                                                <th className="min-w-40 text-left capitalize">
                                                    {stat.type ??
                                                        stat.name ??
                                                        "Players"}
                                                </th>
                                                {stat.labels.map((label) => (
                                                    <th className="w-15 text-center">
                                                        {label.toString()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stat.athletes.map((player) => (
                                                <tr className="text-nowrap">
                                                    <td className="text-left">
                                                        {`${player.athlete.shortName} - ${player.athlete.position.abbreviation}`}
                                                    </td>
                                                    {player.stats.map(
                                                        (stat) => (
                                                            <td className="w-15 text-center">
                                                                {stat.toString()}
                                                            </td>
                                                        ),
                                                    )}
                                                </tr>
                                            ))}
                                            <p>&nbsp;</p>
                                        </tbody>
                                    </>
                                ))}
                            </table>
                        </div>
                    </div>
                ))}
            <p className="text-black dark:text-white">
                Venue:{" "}
                {`${game?.competitions[0].venue.fullName}, ${game?.competitions[0].venue.address.city}`}
            </p>
        </>
    );
}
