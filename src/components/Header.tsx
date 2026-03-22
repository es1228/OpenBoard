export default function Header() {
    return (
        <>
            <div
                className="fixed top-4 left-0 w-screen md:w-fit md:left-4 flex flex-row items-center justify-center gap-4 hover:cursor-pointer hover:opacity-70 md:justify-start"
                onClick={() => open("https://github.com/es1228/OpenBoard")}
            >
                <span className="material-symbols-rounded text-black dark:text-white">
                    scoreboard
                </span>
                <h1 className="text-2xl text-black dark:text-white">
                    OpenBoard
                </h1>
            </div>
        </>
    );
}
