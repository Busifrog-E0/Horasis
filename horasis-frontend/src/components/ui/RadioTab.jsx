const RadioTab = ({ selected, name, value, onSelected = () => { } }) => {
  return (
    <div className="flex gap-x-2 pt-2">
      <input
        className="w-5 h-5 accent-system-primary-btn"
        type="radio"
        name={name}
        id={value}
        value={value}
        checked={value === selected}
        onChange={onSelected}
      />
      <label
        className="cursor-pointer text-system-primary-text capitalize"
        htmlFor={value}
      >
        {value}
        <p className="m-0 text-xs text-gray-500 lowercase">{value}</p>
      </label>
    </div>
  )
}

export default RadioTab
