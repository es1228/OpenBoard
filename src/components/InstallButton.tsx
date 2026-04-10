import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string;
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed",
        platform: string;
    }>
    prompt(): Promise<void>;
}

export default function InstallButton() {
    const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setPromptInstall(e as BeforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);
    const onClick = async () => {
        if (!promptInstall) return;
        promptInstall.prompt();
        const { outcome } = await promptInstall.userChoice;
        if (outcome === "accepted") setPromptInstall(null);
    };
    if (!promptInstall) return null;
    return <button onClick={onClick} className="flex gap-2 items-center rounded-3xl bg-blue-950 p-2 hover:cursor-pointer">
        <span className="material-symbols-rounded">download</span>
        <p className="text-black dark:text-white">Install</p>
    </button>
};
