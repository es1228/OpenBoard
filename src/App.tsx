import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Scorecard from "./components/Scorecard";
import Dropdown from "./components/Dropdown";
import Table from "./components/Table";

type Event = {
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
            records: Array<{
                summary: string;
            }>;
            score: number;
        }>;
    }>;
    status: {
        type: {
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
    const [page, setPage] = useState<string>("Home")
    const [scoreboards, setScoreboards] = useState<Event[]>([]);
    const [standings, setStandings] = useState<StandingEntry[]>([]);
    const [sportLeague, setsportLeague] = useState<string>("hockey/nhl");

    const handleNavbarSelect = (value: string) => {
        setPage(value)
    }

    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setsportLeague(e.target.value);
    };

    useEffect(() => {
        const fetchScoreboards = async () => {
            const response = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/${sportLeague}/scoreboard`,
            );
            const data = await response.json();
            setScoreboards(data.events);
            console.log(data.events);
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
            console.log(data);
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
            <Scorecard
                key={event.id}
                status={event.status.type.shortDetail}
                homeTeamName={homeTeam.team.displayName}
                shortHomeTeam={homeTeam.team.abbreviation}
                homeTeamLogo={homeTeam.team.logo}
                homeTeamScore={homeTeam.score}
                homeTeamRecord={homeTeam.records[0].summary}
                awayTeamName={awayTeam.team.displayName}
                shortAwayTeam={awayTeam.team.abbreviation}
                awayTeamLogo={awayTeam.team.logo}
                awayTeamScore={awayTeam.score}
                awayTeamRecord={awayTeam.records[0].summary}
            />
        );
    });

    const currentCols =
        standingsConfig[sportLeague as keyof typeof standingsConfig];
    
    let content;

    if (page === "Matches") {
        content = (
            <>
                {scoresList}
            </>
        )
    }
    else if (page === "Table") {
        content = (
            <>
                <Table standings={standings} cols={currentCols}/>
            </>
        )
    }

    return (
        <>
            <Header />
            <Navbar handlePageChange={handleNavbarSelect}/>
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
