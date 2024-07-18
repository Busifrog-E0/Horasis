import empty from '../../assets/icons/empty.svg'
const EmptyMembers = ({ emptyText }) => {
  return (
    <div className='flex flex-col gap-3 items-center justify-center w-full p-10  bg-system-secondary-bg rounded-lg'>
      <img src={empty} alt='Empty' className='animate-bounce' />
      <p className='text-brand-gray-dim text-center'>{emptyText}</p>
    </div>
  )
}

export default EmptyMembers
