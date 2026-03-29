import { type StandingEntry } from "../App";

type TableProps = {
    standings: StandingEntry[];
    cols: string[];
};

export default function Table({ standings, cols }: TableProps) {
    if (!standings || standings.length === 0) {
        return <p className="text-black dark:text-white">Loading...</p>;
    }
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
                                const statHeader = standings[0].stats.find(
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
                        {standings.map((entry) => (
                            <tr key={entry.team.abbreviation}>
                                <td className="flex items-center gap-4 py-2 pl-4">
                                    <img
                                        src={entry.team.logos[0].href}
                                        alt={`${entry.team.displayName} Logo`}
                                        className="h-10"
                                    />
                                    <div className="flex">
                                        {entry.stats[1].name === "clincher" &&
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
}
