import { createContext, useContext, useEffect, useState } from 'react';

const ThemeProviderContext = createContext({
    theme: 'system',
    setTheme: () => null,
});

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    ...props
}) => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme,
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: light)',
            ).matches
                ? 'light'
                : 'dark';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const contextValue = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={contextValue} {...props}>
            {children}
        </ThemeProviderContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeProviderContext = createContext({
//     theme: 'system',
//     setTheme: () => null,
// });

// export const ThemeProvider = ({
//     children,
//     defaultTheme = 'system',
//     storageKey = 'vite-ui-theme',
//     ...props
// }) => {
//     const [theme, setTheme] = useState(
//         () => localStorage.getItem(storageKey) || defaultTheme
//     );

//     useEffect(() => {
//         const root = document.documentElement;
//         root.classList.remove('light', 'dark');

//         if (theme === 'system') {
//             const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
//             root.classList.add(prefersLight ? 'light' : 'dark');
//         } else {
//             root.classList.add(theme);
//         }
//     }, [theme]);

//     const contextValue = {
//         theme,
//         setTheme: (newTheme) => {
//             localStorage.setItem(storageKey, newTheme);
//             setTheme(newTheme);
//         },
//     };

//     return (
//         <ThemeProviderContext.Provider value={contextValue} {...props}>
//             {children}
//         </ThemeProviderContext.Provider>
//     );
// };

// export const useTheme = () => {
//     const context = useContext(ThemeProviderContext);
//     if (!context) {
//         throw new Error('useTheme must be used within a ThemeProvider');
//     }
//     return context;
// };
