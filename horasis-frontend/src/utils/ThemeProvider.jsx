import { createContext, useEffect, useState } from "react"
import { ISDARK, _retrieveData, _storeData } from "./LocalStorage"

export const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    _retrieveData(ISDARK) ? _retrieveData(ISDARK) : false
  )

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    _storeData(ISDARK, !isDark)
    setIsDark((isDark) => !isDark)
  }

  const setDarkTheme = () => {
    setIsDark(true)
    document.documentElement.classList.add("dark")
  }
  const setLightTheme = () => {
    setIsDark(false)
    document.documentElement.classList.remove("dark")
  }

  const setAutoTheme = () => {
    if (_retrieveData(ISDARK) === null) {
      // _storeData(ISDARK, true)
      // setDarkTheme()
    } else if (_retrieveData(ISDARK)) {
      setDarkTheme()
    } else {
      setLightTheme()
    }
  }

  useEffect(() => {
    setAutoTheme()
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
