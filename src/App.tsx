import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Scorecard from "./components/Scorecard";
import Dropdown from "./components/Dropdown";

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

export default function App() {
    const [scoreboards, setScoreboards] = useState<Event[]>([]);
    const [scoreboardParams, setScoreboardParams] =
        useState<string>("hockey/nhl");

    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setScoreboardParams(e.target.value);
    }

    useEffect(() => {
        const fetchScoreboards = async () => {
            const response = await fetch(
                `https://site.api.espn.com/apis/site/v2/sports/${scoreboardParams}/scoreboard`,
            );
            const data = await response.json();
            setScoreboards(data.events);
            console.log(data.events);
        };
        fetchScoreboards();
    }, [scoreboardParams]);

    const nhlScoresList = scoreboards.map((event) => {
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

    return (
        <>
            <Header />
            <Navbar />
            <div className="mx-5 mt-20 flex flex-col gap-4 md:ml-50">
                <div className="flex justify-between">
                    <h1 className="text-2xl text-black dark:text-white">
                        Matches
                    </h1>
                    <Dropdown selectedValue={scoreboardParams} handleChange={handleDropdownChange}/>
                </div>
            </div>
            <div className="mx-5 mt-2 mb-30 flex flex-col gap-4 md:mr-5 md:mb-5 md:ml-50">
                {nhlScoresList}
            </div>
        </>
    );
}
