import type { ChangeEvent } from "react";

type DropdownProps = {
    selectedValue: string;
    handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Dropdown({selectedValue, handleChange}: DropdownProps) {
    return (
        <>
            <select
                name="teams"
                id="teamsSelect"
                value={selectedValue}
                onChange={handleChange}
                className="rounded-3xl bg-neutral-400/20 p-2 text-black outline-0 backdrop-blur hover:opacity-70 dark:bg-neutral-800/40 dark:text-white"
            >
                <option value="hockey/nhl">NHL</option>
                <option value="basketball/nba">NBA</option>
                <option value="football/nfl">NFL</option>
                <option value="baseball/mlb">MLB</option>
            </select>
        </>
    );
}
