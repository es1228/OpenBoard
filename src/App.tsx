import { useEffect, useRef, useState, type ChangeEvent } from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Scorecard from "./components/Scorecard";
import Dropdown from "./components/Dropdown";
import Table from "./components/Table";
import GameInfo from "./components/GameInfo";

export type Game = {
    id: string;
    season: {
        type: number;
    };
    competitions: Array<{
        id: number;
        date: string;
        competitors: Array<{
            homeAway: string;
            winner: boolean;
            team: {
                location: string;
                name: string;
                abbreviation: string;
                displayName: string;
                shortDisplayName: string;
                logo?: string;
                logos: Array<{
                    href: string;
                }>;
                color: string;
                id: string;
            };
            linescores: Array<{
                displayValue: string;
                period: number;
            }>;
            statistics: Array<{
                name: string;
                abbreviation: string;
                displayValue: string;
            }>;
            records: Array<{
                summary: string;
            }>;
            record: Array<{
                displayValue: string;
            }>;
            score?: {
                value: number;
                displayValue?: string;
            };
        }>;
        venue: {
            fullName: string;
            address: {
                city: string;
            };
        };
        status?: {
            type: {
                name: string;
                shortDetail: string;
            };
        };
    }>;
};

export type Standings = {
    abbreviation: string;
    name: string;
    shortName: string;
    children: Standings[];
    standings?: {
        entries: StandingEntry[];
    };
};

export type StandingEntry = {
    team: {
        abbreviation: string;
        displayName: string;
        shortDisplayName: string;
        logos: Array<{
            href: string;
        }>;
        id: string;
    };
    stats: Array<{
        name: string;
        displayName: string;
        shortDisplayName: string;
        description: string;
        abbreviation: string;
        displayValue: string;
        value: number;
    }>;
};

export type Summary = {
    plays: Array<{
        text: string;
    }>;
    boxscore: {
        players: Array<{
            statistics: Array<{
                athletes: Array<{
                    athlete: {
                        shortName: string;
                        headshot: {
                            href: string;
                        };
                        position: {
                            abbreviation: string;
                        };
                    };
                    stats: Array<{}>;
                }>;
                labels: Array<{}>;
                type?: string;
                name?: string;
            }>;
            team: {
                displayName: string;
            };
        }>;
    };
};

export const standingsConfig = {
    "hockey/nhl": [
        "points",
        "wins",
        "losses",
        "otLosses",
        "gamesPlayed",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "lasttengames",
        "streak",
    ],
    "basketball/nba": [
        "wins",
        "losses",
        "winPercent",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
    "football/nfl": [
        "wins",
        "losses",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
    "baseball/mlb": [
        "wins",
        "losses",
        "winPercent",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
};

export default function App() {
    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || "system",
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<string>(() => {
        const saved = localStorage.getItem("page");
        return saved ? saved : "Home";
    });
    const [sportLeague, setsportLeague] = useState<string>(() => {
        const saved = localStorage.getItem("sportLeague");
        return saved ? saved : "hockey/nhl";
    });
    const [scoreboards, setScoreboards] = useState<Game[]>([]);
    const [teamScores, setTeamScores] = useState<boolean>(false);
    const [standings, setStandings] = useState<Standings>();
    const [level, setLevel] = useState<number>(() => {
        const saved = parseInt(localStorage.getItem("level") ?? "3");
        return saved;
    });
    const [boxScoreIndex, setBoxScoreIndex] = useState<number>();
    const [selectedTeamID, setSelectedTeamID] = useState<string>("-1");
    const [scoreboardDates, setScoreboardDates] = useState<string>(
        new Date().toLocaleString("sv").slice(0, 10).replaceAll("-", ""),
    );

    useEffect(() => {
        if (page !== "Overview") localStorage.setItem("page", page);
    }, [page]);

    useEffect(() => {
        localStorage.setItem("sportLeague", sportLeague);
    }, [sportLeague]);

    useEffect(() => {
        localStorage.setItem("level", level.toString());
    }, [level]);

    const handleNavbarSelect = (value: string) => {
        setPage(value);
        window.scrollTo({ top: 0 });
    };

    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setsportLeague(e.target.value);
    };

    const handleTableClick = async (id: string) => {
        if (!id) return;

        setSelectedTeamID(id);

        try {
            const response = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/teams/${id}/schedule`,
            );
            const data = await response.json();
            setSelectedTeamID((currentTeamID) => {
                if (currentTeamID !== id) return currentTeamID;

                setScoreboards(data.events);
                setTeamScores(true);
                setPage("Games");
                return id;
            });
        } catch {
            console.error("Could not fetch team schedule");
        }
    };

    useEffect(() => {
        if (selectedTeamID === "-1" || !teamScores) return;
        const fetchLiveGame = async (teamID: string) => {
            try {
                const response = await fetch(
                    `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/scoreboard`,
                );
                const data = await response.json();
                const liveGame = data.events.find((game: Game) =>
                    game.competitions[0].competitors.some(
                        (competitor) => competitor.team.id === teamID,
                    ),
                );

                if (liveGame) {
                    setScoreboards((prevSchedule) =>
                        prevSchedule.map((game) =>
                            game.id === liveGame.id ? liveGame : game,
                        ),
                    );
                }
            } catch {
                console.error("Could not fetch live games");
            }
        };
        fetchLiveGame(selectedTeamID);
    }, [selectedTeamID, teamScores, sportLeague]);

    const openGameInfo = (id: string) => {
        setPage("Overview");
        setBoxScoreIndex(scoreboards.findIndex((game) => game.id === id));
    };

    useEffect(() => {
        const changeTheme = () => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            if (theme === "system")
                if (window.matchMedia("(prefers-color-scheme: dark)").matches)
                    root.classList.add("dark");
                else root.classList.add("light");
            else root.classList.add(theme);
            localStorage.setItem("theme", theme);
        };
        changeTheme();
    }, [theme]);

    useEffect(() => {
        if (!teamScores) {
            const fetchScoreboards = async () => {
                try {
                    const response = await fetch(
                        `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/scoreboard?dates=${scoreboardDates}`,
                    );
                    const data = await response.json();
                    setScoreboards(data.events);
                } catch {
                    console.error("Could not fetch scoreboards");
                }
            };
            fetchScoreboards();
        }
    }, [sportLeague, teamScores, scoreboardDates]);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(
                    `https://site.api.espn.com/apis/v2/sports/${sportLeague}/standings?type=0&level=${level}`,
                );
                const data = await response.json();
                setStandings(data);
            } catch {
                console.error("Could not fetch standings");
            }
        };
        fetchStandings();
    }, [sportLeague, level]);

    useEffect(() => {
        if (teamScores && page === "Games" && scoreboards.length > 0) {
            const timeout = setTimeout(() => {
                if (scrollRef.current)
                    scrollRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [scoreboards, teamScores, page]);

    const scoresList = scoreboards.map((game, index) => {
        const competition = game.competitions[0];
        const competitiors = competition.competitors;

        const targetIndex = scoreboards.findIndex(
            (e) => e.competitions[0].status?.type.name === "STATUS_SCHEDULED",
        );

        const isTarget =
            index ===
            (targetIndex === -1 ? scoreboards.length - 1 : targetIndex);

        const homeTeam = competitiors.find((c) => c.homeAway === "home");
        const awayTeam = competitiors.find((c) => c.homeAway === "away");

        if (!homeTeam || !awayTeam) return null;

        return (
            <div key={game.id} ref={isTarget ? scrollRef : null}>
                <Scorecard
                    game={game}
                    sportLeague={sportLeague}
                    handleClick={() => openGameInfo(game.id)}
                />
            </div>
        );
    });

    const currentCols =
        standingsConfig[sportLeague as keyof typeof standingsConfig];

    const MMDDYYtoDate = (date: string) => {
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(4, 6));
        const day = parseInt(date.substring(6, 8));
        const newDate = new Date(year, month - 1, day);
        return newDate;
    };

    const prevDay = () => {
        const newDate = MMDDYYtoDate(scoreboardDates);
        newDate.setDate(newDate.getDate() - 1);
        setScoreboardDates(
            newDate.toISOString().slice(0, 10).replaceAll("-", ""),
        );
        window.scrollTo({ top: 0 });
    };

    const nextDay = () => {
        const newDate = MMDDYYtoDate(scoreboardDates);
        newDate.setDate(newDate.getDate() + 1);
        setScoreboardDates(
            newDate.toISOString().slice(0, 10).replaceAll("-", ""),
        );
        window.scrollTo({ top: 0 });
    };

    let content;

    if (page === "Games") {
        content = (
            <>
                <div
                    className="rounded-3xl bg-neutral-400/20 p-4 hover:cursor-pointer hover:opacity-70 dark:bg-neutral-800/40"
                    onClick={prevDay}
                >
                    <p className="text-center text-black dark:text-white">
                        Previous {"\u200b"}(
                        {new Date(
                            MMDDYYtoDate(scoreboardDates).setDate(
                                MMDDYYtoDate(scoreboardDates).getDate() - 1,
                            ),
                        ).toDateString()}
                        )
                    </p>
                </div>
                <p className="text-black dark:text-white">
                    {MMDDYYtoDate(scoreboardDates).toDateString()}
                </p>
                {scoresList}
                <div
                    className="rounded-3xl bg-neutral-400/20 p-4 hover:cursor-pointer hover:opacity-70 dark:bg-neutral-800/40"
                    onClick={nextDay}
                >
                    <p className="text-center text-black dark:text-white">
                        Next (
                        {new Date(
                            MMDDYYtoDate(scoreboardDates).setDate(
                                MMDDYYtoDate(scoreboardDates).getDate() + 1,
                            ),
                        ).toDateString()}
                        )
                    </p>
                </div>
            </>
        );
    } else if (page === "Standings") {
        if (!standings) return;
        content = (
            <>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-black dark:text-white">
                            {sportLeague.split("/")[1].toUpperCase()}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-black dark:text-white">Sort By:</p>
                        <Dropdown
                            selectedValue={level.toString()}
                            handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setLevel(parseInt(e.target.value))
                            }
                            values={["1", "2", "3"]}
                            names={["League", "Conference", "Division"]}
                        />
                    </div>
                </div>
                <Table
                    data={standings}
                    cols={currentCols}
                    handleClick={handleTableClick}
                    selectedTeamID={selectedTeamID}
                />
            </>
        );
    } else if (page === "Overview") {
        content = (
            <GameInfo
                game={scoreboards[boxScoreIndex!]}
                sportLeague={sportLeague}
            />
        );
    } else if (page === "Settings") {
        content = (
            <>
                <div className="flex flex-col gap-4 rounded-3xl bg-neutral-400/20 p-4 dark:bg-neutral-800/40">
                    <h1 className="text-black dark:text-white">Theme</h1>
                    <Dropdown
                        handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setTheme(e.target.value)
                        }
                        selectedValue={theme}
                        values={["light", "dark", "system"]}
                        names={["Light", "Dark", "System"]}
                    />
                </div>
            </>
        );
    }

    let controlButton;

    if (page === "Overview") {
        controlButton = (
            <p
                className="fixed top-18 right-5 z-1000 rounded-full bg-neutral-400/20 p-2 px-4 text-black backdrop-blur hover:cursor-pointer dark:bg-neutral-800/40 dark:text-white"
                onClick={() => setPage("Games")}
            >
                X
            </p>
        );
    } else if (teamScores) {
        controlButton = (
            <p
                className="fixed top-18 right-5 z-1000 rounded-full bg-neutral-400/20 p-2 px-4 text-black backdrop-blur hover:cursor-pointer dark:bg-neutral-800/40 dark:text-white"
                onClick={() => {
                    setScoreboards([]);
                    setTeamScores(false);
                    setSelectedTeamID("-1");
                    if (page !== "Standings") setPage("Standings");
                }}
            >
                X
            </p>
        );
    } else {
        controlButton = (
            <Dropdown
                selectedValue={sportLeague}
                handleChange={handleDropdownChange}
                values={[
                    "hockey/nhl",
                    "football/nfl",
                    "basketball/nba",
                    "baseball/mlb",
                ]}
                names={["NHL", "NFL", "NBA", "MLB"]}
            />
        );
    }

    return (
        <>
            <Header />
            <Navbar handlePageChange={handleNavbarSelect} />
            <div className="mx-5 mt-20 flex flex-col gap-4 md:ml-50">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-black dark:text-white">
                        {page}
                    </h1>
                    {controlButton}
                </div>
            </div>
            <div className="mx-5 mt-2 mb-30 flex flex-col gap-4 md:mr-5 md:mb-5 md:ml-50">
                {content}
            </div>
        </>
    );
}
