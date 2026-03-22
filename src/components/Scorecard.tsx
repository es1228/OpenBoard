type ScorecardProps = {
    league: string;
    time: string;
    homeTeamName: string;
    shortHomeTeam: string;
    homeTeamLogo: string;
    homeTeamScore: number;
    homeTeamRecord: string;
    awayTeamName: string;
    shortAwayTeam: string;
    awayTeamLogo: string;
    awayTeamScore: number;
    awayTeamRecord: string;
};

export default function Scorecard({
    league,
    time,
    homeTeamName,
    shortHomeTeam,
    homeTeamLogo,
    homeTeamScore,
    homeTeamRecord,
    awayTeamName,
    shortAwayTeam,
    awayTeamLogo,
    awayTeamScore,
    awayTeamRecord,
}: ScorecardProps) {
    return (
        <>
            <div className="cursor-pointer rounded-3xl bg-neutral-400/20 p-4 hover:opacity-70 dark:bg-neutral-800/40 backdrop-blur">
                <p className="text-black dark:text-white">
                    {league} • {time}
                </p>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-1 flex-col items-start gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Away
                        </h1>
                        <div className="flex items-center gap-4">
                            <img
                                className="w-15 md:w-20"
                                src={awayTeamLogo}
                                alt={`${awayTeamName} Logo`}
                            />
                            <h1 className="text-5xl text-black dark:text-white">
                                {awayTeamScore}
                            </h1>
                        </div>
                        <p className="hidden text-black md:block dark:text-white">
                            {awayTeamName}
                        </p>
                        <p className="block text-black md:hidden dark:text-white">
                            {shortAwayTeam}
                        </p>
                        <p className="text-black dark:text-white">
                            {awayTeamRecord}
                        </p>
                    </div>
                    <p className="text-black dark:text-white">@</p>
                    <div className="flex flex-1 flex-col items-end gap-2">
                        <h1 className="text-lg text-black dark:text-white">
                            Home
                        </h1>
                        <div className="flex items-center gap-4">
                            <h1 className="text-5xl text-black dark:text-white">
                                {homeTeamScore}
                            </h1>
                            <img
                                className="w-15 md:w-20"
                                src={homeTeamLogo}
                                alt={`${homeTeamName} Logo`}
                            />
                        </div>
                        <p className="hidden text-black md:block dark:text-white">
                            {homeTeamName}
                        </p>
                        <p className="block text-black md:hidden dark:text-white">
                            {shortHomeTeam}
                        </p>
                        <p className="text-black dark:text-white">
                            {homeTeamRecord}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
