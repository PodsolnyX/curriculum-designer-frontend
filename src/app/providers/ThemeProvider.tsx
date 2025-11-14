import React, { createContext, useContext, useEffect, useState } from 'react';
import locale from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';
import { App, ConfigProvider } from 'antd';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('ru');

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const LS_THEME_KEY = 'THEME';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem(LS_THEME_KEY) as Theme) || Theme.Dark,
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
    localStorage.setItem(
      LS_THEME_KEY,
      theme === Theme.Light ? Theme.Dark : Theme.Light,
    );
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <App>
        <ConfigProvider
          locale={locale}
          theme={{
            token: {
              colorPrimary: '#74a4a8',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        >
          {children}
        </ConfigProvider>
      </App>
    </ThemeContext.Provider>
  );
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: (localStorage.getItem(LS_THEME_KEY) as Theme) || Theme.Dark,
  toggleTheme() {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};
