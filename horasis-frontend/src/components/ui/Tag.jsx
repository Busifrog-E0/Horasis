
const Tag = ({ tag, removeTag }) => {
  return (
    <p className="bg-system-secondary-bg  cursor-pointer border border-system-file-border shadow-md text-system-primary-text flex items-center gap-x-2 font-bold px-4 py-2 rounded">
      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]">
        {tag}
      </span>
      {/* <Icon
        className="transition ease-out duration-100"
        icon={icons.close.outline}
        onClick={() => {
          removeTag && removeTag(tag)
        }}
      /> */}
    </p>
  )
}

export default Tag
