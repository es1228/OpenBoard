import { type Game } from "../App";

type ScorecardProps = {
    game: Game;
    isOverview: boolean;
    handleClick: () => void;
    handleTeamClick: (id: string) => void;
};

export default function Scorecard({ game, isOverview, handleClick, handleTeamClick }: ScorecardProps) {
    const competition = game.competitions[0];
    const competitiors = competition.competitors;

    const homeTeam = competitiors.find((c) => c.homeAway === "home");
    const awayTeam = competitiors.find((c) => c.homeAway === "away");

    return (
        <>
            <div
                className={`rounded-3xl bg-neutral-400/20 p-4 transition-opacity duration-300 ease-in-out dark:bg-neutral-800/40 ${!isOverview && "hover:cursor-pointer hover:opacity-70"}`}
                onClick={handleClick}
            >
                <div className="w-fit">
                    <h1 className="font-bold text-black dark:text-white">
                        {competition.series?.title}
                    </h1>
                    <h1
                        className={`${
                            competition.status?.type.name ===
                                "STATUS_IN_PROGRESS" ||
                            competition.status?.type.name ===
                                "STATUS_END_PERIOD"
                                ? "text-green-500"
                                : competition.status?.type.name ===
                                        "STATUS_POSTPONED" ||
                                    competition.status?.type.name ===
                                        "STATUS_RAIN_DELAY" ||
                                    competition.status?.type.name ===
                                        "STATUS_DELAYED"
                                  ? "text-yellow-300"
                                  : `text-black dark:text-white ${(competition.status?.type.name === "STATUS_FINAL" || competition.status?.type.name === "STATUS_FULL_TIME" || competition.status?.type.name === "STATUS_FINAL_AET" || competition.status?.type.name === "STATUS_FINAL_PEN") && "font-bold"}`
                        }`}
                    >
                        {competition.status?.type.shortDetail}
                    </h1>
                    <hr
                        className={`animate-back-and-forth h-0.5 rounded-3xl border-none bg-green-500 ${
                            competition.status?.type.name !==
                                "STATUS_IN_PROGRESS" &&
                            competition.status?.type.name !==
                                "STATUS_END_PERIOD" &&
                            competition.status?.type.name !==
                                "STATUS_HALFTIME" &&
                            "hidden"
                        }`}
                    />
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-1 flex-col items-start gap-2 hover:cursor-pointer" onClick={() => handleTeamClick(awayTeam?.team.id!)}>
                        <h1 className="text-lg text-black dark:text-white">
                            Away
                        </h1>
                        <div className="flex items-center gap-4 hover:cursor-pointer">
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
                                {competition.status?.type.name !==
                                    "STATUS_SCHEDULED" &&
                                competition.status?.type.name !==
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
                            {awayTeam?.records?.[0]?.summary ??
                                awayTeam?.record?.[0]?.displayValue}
                        </p>
                    </div>
                    <p className="mb-8 text-5xl text-black dark:text-white">
                        -
                    </p>
                    <div className="flex flex-1 flex-col items-end gap-2 hover:cursor-pointer" onClick={() => handleTeamClick(homeTeam?.team.id!)}>
                        <h1 className="text-lg text-black dark:text-white">
                            Home
                        </h1>
                        <div className="flex items-center gap-4">
                            <h1
                                className={`text-4xl ${homeTeam?.winner ? "text-amber-400" : "text-black dark:text-white"}`}
                            >
                                {competition.status?.type.name !==
                                    "STATUS_SCHEDULED" &&
                                competition.status?.type.name !==
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
                            {homeTeam?.records?.[0]?.summary ??
                                homeTeam?.record?.[0]?.displayValue}
                        </p>
                    </div>
                </div>
                <p className="text-center text-black dark:text-white">
                    {competition?.notes?.[0]?.text}
                </p>
            </div>
        </>
    );
}
