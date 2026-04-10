import type { Team } from "../App";
import type { MouseEvent } from "react";

type SavedTeamProps = {
    team: Team;
    handleDelete: (name: string) => void;
    handleClick: (team: Team) => void;
};

export default function SavedTeam({
    team,
    handleDelete,
    handleClick,
}: SavedTeamProps) {
    return (
        <>
            <div
                className="flex w-full items-center gap-4 rounded-3xl bg-neutral-400/20 p-4 text-black transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 dark:bg-neutral-800/40 dark:text-white"
                onClick={() => handleClick(team)}
            >
                <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="h-10"
                />
                <h1 className="text-2xl">{team.name}</h1>
                <button
                    className="ml-auto flex items-center rounded-full bg-blue-500/30 p-2 hover:cursor-pointer"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDelete(team.name);
                    }}
                >
                    <span className="material-symbols-rounded">delete</span>
                </button>
            </div>
        </>
    );
}
