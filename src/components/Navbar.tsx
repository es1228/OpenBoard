type NavbarProps = {
    handlePageChange: (value: string) => void;
};

export default function Navbar({ handlePageChange }: NavbarProps) {
    return (
        <>
            <nav className="fixed right-5 bottom-5 left-5 z-10000 justify-center rounded-3xl bg-neutral-400/20 backdrop-blur md:top-18 md:w-fit dark:bg-neutral-800/40">
                <ul className="flex h-full justify-center gap-4 p-4 md:flex-col">
                    <li
                        className="flex flex-col items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("Home")}
                    >
                        <span className="material-symbols-rounded text-black dark:text-white">
                            home
                        </span>
                        <p className="text-xs text-black md:text-lg dark:text-white">
                            Home
                        </p>
                    </li>
                    <li
                        className="flex flex-col items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("Games")}
                    >
                        <span className="material-symbols-rounded text-black dark:text-white">
                            scoreboard
                        </span>
                        <p className="text-xs text-black md:text-lg dark:text-white">
                            Games
                        </p>
                    </li>
                    <li
                        className="flex flex-col items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("Standings")}
                    >
                        <span className="material-symbols-rounded text-black dark:text-white">
                            leaderboard
                        </span>
                        <p className="text-xs text-black md:text-lg dark:text-white">
                            Standings
                        </p>
                    </li>
                    <li
                        className="flex flex-col items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:mt-auto md:flex-row"
                        onClick={() => handlePageChange("Settings")}
                    >
                        <span className="material-symbols-rounded text-black dark:text-white">
                            settings
                        </span>
                        <p className="text-xs text-black md:text-lg dark:text-white">
                            Settings
                        </p>
                    </li>
                </ul>
            </nav>
        </>
    );
}
