// import React, { createContext, useContext, useState, useEffect } from 'react';

// const ThemeContext = createContext();

// export const useTheme = () => useContext(ThemeContext);

// export const ThemeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem('darkMode') === 'true'
//   );

//   useEffect(() => {
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   return (
//     <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
