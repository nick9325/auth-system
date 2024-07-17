"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher({ className }) {
    const theme_switcher = true;
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    useEffect(() => setMounted(true), []);

    return (
        <>
            {theme_switcher && (
                <div className={`theme-switcher fixed right-6 top-4 ${className}`}>
                    <label htmlFor="theme-switcher" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                id="theme-switcher"
                                type="checkbox"
                                className="sr-only"
                                defaultChecked={
                                    mounted && (theme === "dark" || resolvedTheme === "dark")
                                }
                                onClick={() =>
                                    setTheme(
                                        theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
                                    )
                                }
                            />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div
                                className={`dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition ${theme === "dark" || resolvedTheme === "dark"
                                    ? "transform translate-x-full bg-black "
                                    : "bg-white"
                                    }`}
                            ></div>
                        </div>
                        

                    </label>
                </div>


            )}
        </>
    );
};

