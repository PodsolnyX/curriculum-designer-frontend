import React, {createContext, useContext, useEffect, useState} from "react";

export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

const LS_THEME_KEY = "THEME"

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [theme, setTheme] = useState<Theme>(localStorage.getItem(LS_THEME_KEY) as Theme || Theme.Dark);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)
        localStorage.setItem(LS_THEME_KEY, theme === Theme.Light ? Theme.Dark : Theme.Light)
    }

    const value: ThemeContextValue = {
        theme,
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

interface ThemeContextValue {
    theme: Theme,
    toggleTheme(): void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: localStorage.getItem(LS_THEME_KEY) as Theme || Theme.Dark,
    toggleTheme() {}
});

export const useTheme = () => {
    return useContext(ThemeContext);
}