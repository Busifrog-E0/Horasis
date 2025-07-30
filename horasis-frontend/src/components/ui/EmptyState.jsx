import { useContext } from "react"
import { ThemeContext } from "../../utils/ThemeProvider"

const EmptyState = ({ text, icon }) => {
  const { isDark } = useContext(ThemeContext)
  return (
    <div className="flex flex-col gap-3 items-center justify-center w-full p-24  bg-system-secondary-bg  mb-20 rounded-lg border  border-brand-light-gray ">
      {/* {isDark ? (
       
        <img src={empty} className="opacity-50" />
      ) : (
        <img src={empty} />
      )} */}
      {/* <Icon
        className="text-system-secondary-text"
        icon={icon}
        height={40}
      /> */}
      <p className="font-light text-center text-brand-primary">{text}</p>
    </div>
  )
}

export default EmptyState
