import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeProvider"


const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <div
      className="text-brand-gray-dim cursor-pointer text-md font-medium"
      onClick={toggleTheme}
    >
      {isDark ? (
        <span className="">Light theme</span>
      ) : (
        <span className="">Dark theme</span>
      )}
    </div>
  )
}

export default ThemeSwitcher
