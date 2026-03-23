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
            <table className="bg-neutral-400/20 dark:bg-neutral-800/40 rounded-3xl">
                <thead>
                    <tr>
                        <th className="text-black dark:text-white p-4">Team</th>
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
                <tbody className="text-black dark:text-white text-center">
                        {standings.map((entry) => (
                            <tr key={entry.team.abbreviation}>
                                <td className="flex items-center gap-4 px-4 py-2">
                                    <img src={entry.team.logos[0].href} alt={`${entry.team.displayName} Logo`} className="h-10" />
                                    {entry.team.displayName}
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
        </>
    );
}
