import { useEffect, useState } from "react";
import { type Game, type Summary } from "../App";

type ScorecardProps = {
    game: Game;
    sportLeague: string;
    handleClick: () => void;
};

export default function Scorecard({
    game,
    sportLeague,
    handleClick,
}: ScorecardProps) {
    const [gameSummary, setGameSummary] = useState<Summary>();

    const competition = game.competitions[0];
    const competitiors = competition.competitors;

    const homeTeam = competitiors.find((c) => c.homeAway === "home");
    const awayTeam = competitiors.find((c) => c.homeAway === "away");

    // useEffect(() => {
    //     const fetchSummary = async () => {
    //         try {
    //             if (game.competitions[0].status?.type.name === "STATUS_IN_PROGRESS") {
    //             const response = await fetch(
    //                 `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/summary?game=${game.id}`,
    //             );
    //             const data = await response.json();
    //             setGameSummary(data);
    //         }
    //         }
    //         catch {
    //             console.error("Could not fetch game summary")
    //         }
    //     };
    //     fetchSummary();
    // }, [sportLeague, game.id]);

    return (
        <>
            <div
                className="cursor-pointer rounded-3xl bg-neutral-400/20 p-4 backdrop-blur hover:opacity-70 dark:bg-neutral-800/40"
                onClick={handleClick}
            >
                <div className="w-fit">
                    <p
                        className={`${
                            game.competitions[0].status?.type.name ===
                            "STATUS_IN_PROGRESS"
                                ? "text-green-500"
                                : (game.competitions[0].status?.type.name ===
                                    "STATUS_POSTPONED" || game.competitions[0].status?.type.name === "STATUS_RAIN_DELAY")
                                  ? "text-yellow-300"
                                  : "text-black dark:text-white"
                        }`}
                    >
                        {game.competitions[0].status?.type.shortDetail}
                    </p>
                    <hr
                        className={`h-0.5 rounded-3xl border-none bg-green-500 animate-back-and-forth ${
                            game.competitions[0].status?.type.name !==
                                "STATUS_IN_PROGRESS" && "hidden"
                        }`}
                    />
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-1 flex-col items-start gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Away
                        </h1>
                        <div className="flex items-center gap-4">
                            <img
                                className="w-15 md:w-20"
                                src={
                                    awayTeam?.team.logo ??
                                    awayTeam?.team.logos[0].href
                                }
                                alt={`${awayTeam?.team.name} Logo`}
                            />
                            <h1
                                className={`text-4xl ${awayTeam?.winner ? "text-amber-300" : "text-black dark:text-white"}`}
                            >
                                {game.competitions[0].status?.type.name !==
                                    "STATUS_SCHEDULED" &&
                                game.competitions[0].status?.type.name !==
                                    "STATUS_POSTPONED"
                                    ? typeof awayTeam?.score === "object"
                                        ? awayTeam?.score?.displayValue
                                        : awayTeam?.score
                                    : ""}
                            </h1>
                        </div>
                        <p className="hidden text-black md:block dark:text-white">
                            {awayTeam?.team.displayName}
                        </p>
                        <p className="block text-black md:hidden dark:text-white">
                            {awayTeam?.team.abbreviation}
                        </p>
                        <p className="text-black dark:text-white">
                            {awayTeam?.records?.[0].summary ??
                                awayTeam?.record?.[0].displayValue}
                        </p>
                    </div>
                    <p className="mb-8 text-5xl text-black dark:text-white">
                        -
                    </p>
                    <div className="flex flex-1 flex-col items-end gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Home
                        </h1>
                        <div className="flex items-center gap-4">
                            <h1
                                className={`text-4xl ${homeTeam?.winner ? "text-amber-400" : "text-black dark:text-white"}`}
                            >
                                {game.competitions[0].status?.type.name !==
                                    "STATUS_SCHEDULED" &&
                                game.competitions[0].status?.type.name !==
                                    "STATUS_POSTPONED"
                                    ? typeof homeTeam?.score === "object"
                                        ? homeTeam?.score?.displayValue
                                        : homeTeam?.score
                                    : ""}
                            </h1>
                            <img
                                className="w-15 md:w-20"
                                src={
                                    homeTeam?.team.logo ??
                                    homeTeam?.team.logos[0].href
                                }
                                alt={`${homeTeam?.team.name} Logo`}
                            />
                        </div>
                        <p className="hidden text-black md:block dark:text-white">
                            {homeTeam?.team.displayName}
                        </p>
                        <p className="block text-black md:hidden dark:text-white">
                            {homeTeam?.team.abbreviation}
                        </p>
                        <p className="text-black dark:text-white">
                            {homeTeam?.records?.[0].summary ??
                                homeTeam?.record?.[0].displayValue}
                        </p>
                    </div>
                </div>
                <p className="text-center text-black dark:text-white">
                    {gameSummary?.plays?.[gameSummary.plays.length - 1]?.text ??
                        ""}
                </p>
            </div>
        </>
    );
}
