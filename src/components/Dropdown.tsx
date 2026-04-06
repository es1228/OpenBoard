import { useEffect, useRef, useState, type MouseEvent } from "react";

type DropdownProps = {
    selectedValue: string;
    handleChange: (e: MouseEvent<HTMLLIElement>) => void;
    values: string[];
    names: string[];
};

export default function Dropdown({
    selectedValue,
    handleChange,
    values,
    names,
}: DropdownProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const clickRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: Event) => {
            if (
                clickRef.current &&
                !clickRef.current.contains(e.target as Node)
            )
                setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    return (
        <div className="relative" ref={clickRef}>
            <button
                className="flex w-full min-w-20 justify-between rounded-3xl bg-neutral-400/20 px-4 py-2 text-black transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 dark:bg-neutral-800/40 dark:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {names[values.indexOf(selectedValue)]}
                <p
                    className={`inline-block transition-transform duration-300 ${menuOpen ? "rotate-180" : "rotate-0"}`}
                >
                    ▾
                </p>
            </button>
            {menuOpen && (
                <ul
                    className="animate-dropdown-in absolute top-full left-1/2 z-1000000 mt-2 w-full -translate-x-1/2 rounded-3xl bg-neutral-400/20 p-2 text-black backdrop-blur dark:bg-neutral-800/40 dark:text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    {values.map((val, index) => (
                        <li
                            key={val}
                            className="flex gap-2 p-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70"
                            data-value={val}
                            onClick={handleChange}
                        >
                            <p className="w-4">
                                {val === selectedValue ? "✓" : ""}
                            </p>
                            {names[index]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
