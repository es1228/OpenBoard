import { useEffect, useState } from "react";
import { type Event, type Summary } from "../App";

type ScorecardProps = {
    event: Event;
    sportLeague: string;
    handleClick: () => void;
};

export default function Scorecard({ event, sportLeague, handleClick }: ScorecardProps) {
    const [gameSummary, setGameSummary] = useState<Summary>();

    const competition = event.competitions[0];
    const competitiors = competition.competitors;

    const homeTeam = competitiors.find((c) => c.homeAway === "home");
    const awayTeam = competitiors.find((c) => c.homeAway === "away");

    useEffect(() => {
        const fetchSummary = async () => {
            if (event.status.type.name === "STATUS_IN_PROGRESS") {
                const response = await fetch(
                    `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/summary?event=${event.id}`,
                );
                const data = await response.json();
                setGameSummary(data);
            }
        };
        fetchSummary();
    }, [sportLeague, event.id]);
    return (
        <>
            <div className="cursor-pointer rounded-3xl bg-neutral-400/20 p-4 backdrop-blur hover:opacity-70 dark:bg-neutral-800/40" onClick={handleClick}>
                <p className="text-black dark:text-white">{event.status.type.shortDetail}</p>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-1 flex-col items-start gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Away
                        </h1>
                        <div className="flex items-center gap-4">
                            <img
                                className="w-15 md:w-20"
                                src={awayTeam?.team.logo}
                                alt={`${awayTeam?.team.name} Logo`}
                            />
                            <h1 className={`text-5xl ${awayTeam?.winner ? "text-amber-300" : "text-black dark:text-white"}`}>
                                {awayTeam?.score}
                            </h1>
                        </div>
                        <p className="hidden text-black md:block dark:text-white">
                            {awayTeam?.team.displayName}
                        </p>
                        <p className="block text-black md:hidden dark:text-white">
                            {awayTeam?.team.abbreviation}
                        </p>
                        <p className="text-black dark:text-white">
                            {awayTeam?.records[0].summary}
                        </p>
                    </div>
                    <p className="text-black dark:text-white text-5xl mb-8">-</p>
                    <div className="flex flex-1 flex-col items-end gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Home
                        </h1>
                        <div className="flex items-center gap-4">
                            <h1 className={`text-5xl ${homeTeam?.winner ? "text-amber-400" : "text-black dark:text-white"}`}>
                                {homeTeam?.score}
                            </h1>
                            <img
                                className="w-15 md:w-20"
                                src={homeTeam?.team.logo}
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
                            {homeTeam?.records[0].summary}
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
