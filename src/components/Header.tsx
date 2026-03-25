export default function Header() {
    return (
        <>
            <div
                className="absolute top-4 left-0 z-10000 flex w-screen flex-col items-center justify-center hover:cursor-pointer hover:opacity-70 md:fixed md:left-4 md:w-fit md:justify-start"
                onClick={() => open("https://github.com/es1228/OpenBoard")}
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-black dark:text-white">
                        scoreboard
                    </span>
                    <h1 className="text-2xl text-black dark:text-white">
                        OpenBoard
                    </h1>
                </div>
                <p className="text-xs text-black dark:text-white text-center">
                    Scoreboards. Stats. Sports.
                </p>
            </div>
        </>
    );
}
