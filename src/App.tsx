import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Scorecard from "./components/Scorecard";

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
};

export default function App() {
    const [nhlScoreboards, setNHLScoreboards] = useState<Event[]>([]);

    useEffect(() => {
        const fetchNHLScoreboards = async () => {
            const response = await fetch(
                "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
            );
            const data = await response.json();
            setNHLScoreboards(data.events);
            console.log(data.events);
        };
        fetchNHLScoreboards();
    }, []);

    const nhlScoresList = nhlScoreboards.map((event) => {
        const competition = event.competitions[0];
        const competitiors = competition.competitors;
        const homeTeam = competitiors.find((c) => c.homeAway === "home");
        const awayTeam = competitiors.find((c) => c.homeAway === "away");
        if (!homeTeam || !awayTeam) return null;
        return (
            <Scorecard
                key={event.id}
                league="NHL"
                time={new Date(competition.date).toLocaleTimeString()}
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
                    <select
                        name="teams"
                        id="teamsSelect"
                        className="rounded-3xl bg-neutral-400/20 p-2 text-black outline-0 hover:opacity-70 dark:bg-neutral-800/40 dark:text-white backdrop-blur"
                    >
                        <option value="nhl">NHL</option>
                        <option value="nba">NBA</option>
                        <option value="nba">NFL</option>
                        <option value="mlb">MLB</option>
                    </select>
                </div>
            </div>
            <div className="mx-5 mt-2 mb-5 flex flex-col gap-4 md:mr-5 md:ml-50">
                {nhlScoresList}
            </div>
        </>
    );
}
