import { useEffect, useState } from "react"
const Checkbox = ({
  label,
  labelClassName = "",
  checked,
  className = "",
  onChange,
  ...props
}) => {
  return (
    <label className="flex items-start cursor-pointer">
      <input
        className={"w-5 h-5 accent-system-primary-btn cursor-pointer " + className}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <span className={"mx-2 text-system-primary-text" + labelClassName}>
        {label}
      </span>
    </label>
  )
}
export default Checkbox
