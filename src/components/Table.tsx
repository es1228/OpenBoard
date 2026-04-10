import { type MouseEvent } from "react";
import { Fragment } from "react/jsx-runtime";
import { type StandingEntry, type Standings, type Team } from "../App";

type TableProps = {
    data: Standings;
    cols: string[];
    handleClick: (id: string) => void;
    selectedTeamID: string;
    sportLeague: string;
    wildCard: boolean;
    level: number;
    handleSave: (
        id: string,
        name: string,
        logo: string,
        sportLeague: string,
    ) => void;
    handleDelete: (id: string) => void;
    savedTeams: Team[];
};

export default function Table({
    data,
    cols,
    handleClick,
    selectedTeamID,
    sportLeague,
    wildCard,
    level,
    handleSave,
    handleDelete,
    savedTeams,
}: TableProps) {
    if (!data) {
        return <p className="text-black dark:text-white">Loading...</p>;
    }

    const hasChildren: boolean = data.children && data.children.length > 0;

    if (hasChildren) {
        return data.children.map((group) => (
            <div key={group.name} className="flex flex-col gap-2">
                <h1 className="text-lg text-black dark:text-white">
                    {group.shortName ?? group.name}
                </h1>
                <Table
                    data={group}
                    cols={cols}
                    handleClick={handleClick}
                    selectedTeamID={selectedTeamID}
                    sportLeague={sportLeague}
                    wildCard={wildCard}
                    level={level}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    savedTeams={savedTeams}
                />
            </div>
        ));
    }

    if (data.standings?.entries) {
        return (
            <StandingsTable
                data={data}
                cols={cols}
                handleClick={handleClick}
                selectedTeamID={selectedTeamID}
                sportLeague={sportLeague}
                wildCard={wildCard}
                level={level}
                handleSave={handleSave}
                handleDelete={handleDelete}
                savedTeams={savedTeams}
            />
        );
    }
}

const StandingsTable = ({
    data,
    cols,
    handleClick,
    selectedTeamID,
    sportLeague,
    wildCard,
    level,
    handleSave,
    handleDelete,
    savedTeams,
}: TableProps) => {
    let dividerIndex;
    if (!wildCard) dividerIndex = -1;
    else if (sportLeague === "hockey/nhl") dividerIndex = 1;
    else if (sportLeague === "baseball/mlb") dividerIndex = 2;
    else if (sportLeague === "football/nfl") dividerIndex = 6;
    else dividerIndex = -1;

    return (
        <>
            <div className="overflow-x-auto rounded-3xl bg-neutral-400/20 dark:bg-neutral-800/40">
                <table className="w-full min-w-150 table-auto border-collapse tabular-nums">
                    <thead>
                        <tr>
                            <th className="p-4 text-black dark:text-white">
                                Team
                            </th>
                            {cols.map((key) => {
                                const statHeader =
                                    data.standings?.entries[0].stats.find(
                                        (s) => s.name === key,
                                    );
                                return (
                                    <th
                                        key={key}
                                        className="text-black dark:text-white"
                                    >
                                        {statHeader?.abbreviation}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="text-center text-black dark:text-white">
                        {data.standings?.entries
                            .toSorted((a: StandingEntry, b: StandingEntry) => {
                                if (level !== 1) {
                                    const statA1 =
                                        a.stats?.find(
                                            (s) => s.name === "playoffSeed",
                                        )?.value ?? 0;
                                    const statB1 =
                                        b.stats?.find(
                                            (s) => s.name === "playoffSeed",
                                        )?.value ?? 0;
                                    if (statA1 - statB1 !== 0)
                                        return statA1 - statB1;
                                }

                                const statA2 =
                                    a.stats?.find((s) => s.name === "points")
                                        ?.value ?? 0;
                                const statB2 =
                                    b.stats?.find((s) => s.name === "points")
                                        ?.value ?? 0;
                                if (statB2 - statA2 !== 0)
                                    return statB2 - statA2;

                                const statA3 =
                                    a.stats?.find(
                                        (s) => s.name === "gamesPlayed",
                                    )?.value ?? 0;
                                const statB3 =
                                    b.stats?.find(
                                        (s) => s.name === "gamesPlayed",
                                    )?.value ?? 0;
                                if (statB3 - statA3 !== 0)
                                    return statA3 - statB3;

                                const statA4 =
                                    a.stats?.find((s) => s.name === "wins")
                                        ?.value ?? 0;
                                const statB4 =
                                    b.stats?.find((s) => s.name === "wins")
                                        ?.value ?? 0;
                                return statB4 - statA4;
                            })
                            .map((entry, index) => (
                                <Fragment key={entry.team.id}>
                                    <tr
                                        className="hover:cursor-pointer hover:opacity-70"
                                        onClick={() =>
                                            entry.team.id &&
                                            handleClick(entry.team.id)
                                        }
                                    >
                                        <td className="flex items-center gap-4 py-2 pl-4">
                                            <img
                                                src={entry.team.logos[0].href}
                                                alt={`${entry.team.displayName} Logo`}
                                                className="h-10"
                                            />
                                            <div className="flex gap-1">
                                                <p>
                                                    {entry.stats.find(
                                                        (s) =>
                                                            s.name ===
                                                            "clincher",
                                                    ) &&
                                                        entry.stats.find(
                                                            (s) =>
                                                                s.name ===
                                                                "clincher",
                                                        )?.displayValue +
                                                            " - \u200b"}
                                                </p>
                                                <p
                                                    className={`hidden md:block ${selectedTeamID === entry.team.id && "underline"}`}
                                                >
                                                    {entry.team.displayName}
                                                </p>
                                                <p
                                                    className={`block md:hidden ${selectedTeamID === entry.team.id && "underline"}`}
                                                >
                                                    {entry.team.abbreviation}
                                                </p>
                                                {savedTeams.some(
                                                    (team) =>
                                                        team.id ===
                                                        entry.team.id,
                                                ) ? (
                                                    <span
                                                        className="material-symbols-rounded"
                                                        onClick={(
                                                            e: MouseEvent<HTMLSpanElement>,
                                                        ) => {
                                                            handleDelete(
                                                                entry.team.displayName,
                                                            );
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        stars
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-symbols-rounded"
                                                        onClick={(
                                                            e: MouseEvent<HTMLSpanElement>,
                                                        ) => {
                                                            handleSave(
                                                                entry.team.id,
                                                                entry.team.displayName,
                                                                entry.team
                                                                    .logos[0]
                                                                    .href,
                                                                sportLeague,
                                                            );
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        star
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {cols.map((key) => {
                                            const statValue = entry.stats.find(
                                                (s) => s.name === key,
                                            );
                                            return (
                                                <td key={key}>
                                                    {statValue?.displayValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {index === dividerIndex && (
                                        <tr>
                                            <td colSpan={cols.length + 1}>
                                                <hr className="bg-black: mx-2 h-px rounded-3xl border-0 dark:bg-white" />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
