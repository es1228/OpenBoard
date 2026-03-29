import { type StandingEntry, type Standings } from "../App";

type TableProps = {
    data: Standings;
    cols: string[];
    sportLeague: string;
};

export default function Table({ data, cols, sportLeague }: TableProps) {
    if (!data) {
        return <p className="text-black dark:text-white">Loading...</p>;
    }

    const hasChildren: boolean = data.children && data.children.length > 0;

    if (hasChildren) {
        return data.children.map((group) => (
            <div key={group.name} className="flex flex-col gap-2">
                <h1 className="text-black dark:text-white text-lg">{group.shortName ?? group.name}</h1>
                <Table data={group} cols={cols} sportLeague={sportLeague} />
            </div>
        ));
    }

    if (data.standings?.entries) {
        return (
            <StandingsTable data={data} cols={cols} sportLeague={sportLeague} />
        );
    }
}

const StandingsTable = ({ data, cols, sportLeague }: TableProps) => {
    return (
        <>
            <div className="overflow-x-auto rounded-3xl bg-neutral-400/20 dark:bg-neutral-800/40">
                <table className="w-full min-w-150 table-auto border-collapse">
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
                                const sortKey =
                                    sportLeague === "hockey/nhl"
                                        ? "points"
                                        : "leagueWinPercent";

                                const statA =
                                    a.stats?.find((s) => s.name === sortKey)
                                        ?.value ?? 0;
                                const statB =
                                    b.stats?.find((s) => s.name === sortKey)
                                        ?.value ?? 0;

                                return statB - statA;
                            })
                            .map((entry) => (
                                <tr key={entry.team.abbreviation}>
                                    <td className="flex items-center gap-4 py-2 pl-4">
                                        <img
                                            src={entry.team.logos[0].href}
                                            alt={`${entry.team.displayName} Logo`}
                                            className="h-10"
                                        />
                                        <div className="flex">
                                            {entry.stats[1].name ===
                                                "clincher" &&
                                                `${entry.stats[1].displayValue} - \u200b`}
                                            <p className="hidden md:block">
                                                {entry.team.displayName}
                                            </p>
                                            <p className="block md:hidden">
                                                {entry.team.abbreviation}
                                            </p>
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
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
