type NavbarProps = {
    page: string;
    handlePageChange: (value: string) => void;
};

export default function Navbar({ page, handlePageChange }: NavbarProps) {
    return (
        <>
            <nav className="fixed right-5 bottom-5 left-5 z-10000 justify-center rounded-3xl bg-neutral-400/20 backdrop-blur md:top-18 md:w-fit dark:bg-neutral-800/40">
                <ul className="flex h-full items-center justify-center gap-4 p-4 md:flex-col md:items-baseline md:justify-start">
                    <li
                        className="flex flex-col-reverse items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("My Teams")}
                    >
                        {page === "My Teams" && (
                            <span className="animate-in h-1 w-6 rounded-3xl bg-blue-500 md:h-6 md:w-1"></span>
                        )}
                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="material-symbols-rounded text-black dark:text-white">
                                home
                            </span>
                            <p className="text-xs text-black md:text-lg dark:text-white">
                                My Teams
                            </p>
                        </div>
                    </li>
                    <li
                        className="flex flex-col-reverse items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("Games")}
                    >
                        {page === "Games" && (
                            <span className="animate-in h-1 w-6 rounded-3xl bg-blue-500 md:h-6 md:w-1"></span>
                        )}
                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="material-symbols-rounded text-black dark:text-white">
                                scoreboard
                            </span>
                            <p className="text-xs text-black md:text-lg dark:text-white">
                                Games
                            </p>
                        </div>
                    </li>
                    <li
                        className="flex flex-col-reverse items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row"
                        onClick={() => handlePageChange("Standings")}
                    >
                        {page === "Standings" && (
                            <span className="animate-in h-1 w-6 rounded-3xl bg-blue-500 md:h-6 md:w-1"></span>
                        )}
                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="material-symbols-rounded text-black dark:text-white">
                                leaderboard
                            </span>
                            <p className="text-xs text-black md:text-lg dark:text-white">
                                Standings
                            </p>
                        </div>
                    </li>
                    <li
                        className="flex flex-col-reverse items-center gap-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70 md:flex-row md:last:mt-auto"
                        onClick={() => handlePageChange("Settings")}
                    >
                        {page === "Settings" && (
                            <span className="animate-in h-1 w-6 rounded-3xl bg-blue-500 md:h-6 md:w-1"></span>
                        )}
                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <span className="material-symbols-rounded text-black dark:text-white">
                                settings
                            </span>
                            <p className="text-xs text-black md:text-lg dark:text-white">
                                Settings
                            </p>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
}
