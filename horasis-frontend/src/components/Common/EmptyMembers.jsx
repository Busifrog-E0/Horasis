import empty from '../../assets/icons/empty.svg'
const EmptyMembers = ({ emptyText }) => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-2 py-10'>
      <img src={empty} alt='Empty' className='animate-bounce' />
      <p className='text-brand-gray-dim'>{emptyText}</p>
    </div>
  )
}

export default EmptyMembers
