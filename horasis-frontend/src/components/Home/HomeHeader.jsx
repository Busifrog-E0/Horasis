import { useContext, useState } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import menu from '../../assets/icons/menu.svg'

const HomeHeader = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const { currentUserData } = useContext(AuthContext)
	const navigate = useNavigate()
	const handleNavigate = () => navigate('/')
	const handleLoginNavigate = () => navigate('/login')
	const handleNavigateDiscussions = () => (currentUserData ? navigate('/Discussions') : navigate('/login'))

	return (
		<div className='flex items-center justify-center bg-system-primary-accent-transparent  px-4 sm:px-8 md:px-16 lg:px-20 py-4'>
			<div className='flex items-center justify-between w-full max-w-screen-2xl'>
				<div className='text-3xl font-bold  text-system-secondary-bg'>
					<h4>Horasis</h4>
				</div>
				<div className='hidden md:flex gap-10 items-center justify-between'>
					<nav className='flex text-system-secondary-bg gap-10'>
						<p className='text-md font-medium cursor-pointer'>Events</p>
						<p className='text-md font-medium cursor-pointer' onClick={handleNavigateDiscussions}>
							Discussions
						</p>
						{/* <p className='text-md font-medium cursor-pointer'>Insight</p> */}
						<p className='text-md font-medium cursor-pointer'>Contact</p>
					</nav>
					{currentUserData ? (
						<>
							<div>
								<button
									className='text-system-secondary-bg py-1 px-4 border-2 rounded-full font-medium'
									onClick={handleNavigate}>
									View Activities
								</button>
							</div>
						</>
					) : (
						<>
							<div>
								<button
									className='text-system-secondary-bg py-1 px-6 font-medium border-2 rounded-full'
									onClick={handleLoginNavigate}>
									Login
								</button>
							</div>
						</>
					)}
				</div>
				<div className='flex md:hidden relative items-center  gap-4'>
					{currentUserData ? (
						<>
							{' '}
							<div>
								<button
									className='text-system-secondary-bg py-1 px-4 border-2 font-medium rounded-full'
									onClick={handleNavigate}>
									View Activities
								</button>
							</div>
						</>
					) : (
						<>
							<div>
								<button
									className='text-system-secondary-bg py-1 px-6 font-medium border-2 rounded-full'
									onClick={handleLoginNavigate}>
									Login
								</button>
							</div>
						</>
					)}
					<img src={menu} alt='' className='h-8' onClick={() => setMenuOpen((prev) => !prev)} />
					{/* <p className='text-system-secondary-bg cursor-pointer' onClick={() => setMenuOpen((prev) => !prev)}>
						menu
					</p> */}
					{menuOpen && (
						<div
							className={`flex absolute h-max w-max bg-white top-16  right-0  px-10  py-6  flex-col items-end gap-10 rounded-lg`}>
							<div>
								<nav className='flex flex-col text-system-primary-accent gap-10'>
									<p className='text-lg'>Events</p>
									<p className='text-lg'>Discussions</p>
									<p className='text-lg'>Insight</p>
									<p className='text-lg'>Contact</p>
								</nav>
							</div>
						</div>
					)}
				</div>{' '}
			</div>
		</div>
	)
}

export default HomeHeader
