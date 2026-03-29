import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Scorecard from "./components/Scorecard";
import Dropdown from "./components/Dropdown";
import Table from "./components/Table";
import GameInfo from "./components/GameInfo";

export type Event = {
    id: string;
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
                logo: string;
            };
            linescores: Array<{
                displayValue: string;
                period: number;
            }>;
            records: Array<{
                summary: string;
            }>;
            score: number;
        }>;
    }>;
    status: {
        type: {
            name: string;
            shortDetail: string;
        };
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
    };
    stats: Array<{
        name: string;
        displayName: string;
        shortDisplayName: string;
        description: string;
        abbreviation: string;
        displayValue: string;
    }>;
};

export type Summary = {
    plays: Array<{
        text: string;
    }>;
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
        "leagueWinPercent",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
    "football/nfl": [
        "wins",
        "losses",
        "leagueWinPercent",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
    "baseball/mlb": [
        "wins",
        "losses",
        "leagueWinPercent",
        "gamesBehind",
        "pointsFor",
        "pointsAgainst",
        "pointDifferential",
        "streak",
    ],
};

export default function App() {
    const [page, setPage] = useState<string>(() => {
        const saved = localStorage.getItem("page");
        return saved ? saved : "Home";
    });
    const [sportLeague, setsportLeague] = useState<string>(() => {
        const saved = localStorage.getItem("sportLeague");
        return saved ? saved : "hockey/nhl";
    });
    const [scoreboards, setScoreboards] = useState<Event[]>([]);
    const [standings, setStandings] = useState<StandingEntry[]>([]);
    const [boxScoreIndex, setBoxScoreIndex] = useState<number>();

    useEffect(() => {
        if (page !== "Box Score")
            localStorage.setItem("page", page);
    }, [page]);

    useEffect(() => {
        localStorage.setItem("sportLeague", sportLeague);
    }, [sportLeague]);

    const handleNavbarSelect = (value: string) => {
        setPage(value);
    };

    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setsportLeague(e.target.value);
    };

    const openGameInfo = (id: string) => {
        setPage("Box Score")
        setBoxScoreIndex(scoreboards.findIndex(event => event.id === id))
    }

    useEffect(() => {
        const fetchScoreboards = async () => {
            const response = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/scoreboard`,
            );
            const data = await response.json();
            console.log(data.events);
            setScoreboards(data.events);
        };
        fetchScoreboards();
    }, [sportLeague]);

    useEffect(() => {
        const fetchStandings = async () => {
            const response = await fetch(
                `https://site.api.espn.com/apis/v2/sports/${sportLeague}/standings?type=0&level=1`,
            );
            const data = await response.json();
            setStandings(data.standings.entries);
        };
        fetchStandings();
    }, [sportLeague]);

    const scoresList = scoreboards.map((event) => {
        const competition = event.competitions[0];
        const competitiors = competition.competitors;

        const homeTeam = competitiors.find((c) => c.homeAway === "home");
        const awayTeam = competitiors.find((c) => c.homeAway === "away");

        if (!homeTeam || !awayTeam) return null;

        return (
            <Scorecard key={event.id} event={event} sportLeague={sportLeague} handleClick={() => openGameInfo(event.id)} />
        );
    });

    const currentCols =
        standingsConfig[sportLeague as keyof typeof standingsConfig];

    let content;

    if (page === "Matches") {
        content = <>{scoresList}</>;
    } else if (page === "Table") {
        content = <Table standings={standings} cols={currentCols} />;
    } else if (page === "Box Score") {
        content = <GameInfo game={scoreboards[boxScoreIndex!]} sportLeague={sportLeague}/>
    }

    return (
        <>
            <Header />
            <Navbar handlePageChange={handleNavbarSelect} />
            <div className="mx-5 mt-20 flex flex-col gap-4 md:ml-50">
                <div className="flex justify-between">
                    <h1 className="text-2xl text-black dark:text-white">
                        {page}
                    </h1>
                    <Dropdown
                        selectedValue={sportLeague}
                        handleChange={handleDropdownChange}
                    />
                </div>
            </div>
            <div className="mx-5 mt-2 mb-30 flex flex-col gap-4 md:mr-5 md:mb-5 md:ml-50">
                {content}
            </div>
        </>
    );
}
