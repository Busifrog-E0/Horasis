import { NavLink } from 'react-router-dom'

const SuperadminSidebar = ({ toggleSidebar = () => {} }) => {
	return (
		<>
			{/* Sidebar */}
			<div className='fixed inset-y-0 left-0 w-64 bg-system-secondary-bg text-system-primary-text p-5 flex flex-col transform lg:translate-x-0 lg:relative lg:flex lg:w-64 h-full border-r'>
				{/* Navigation Links */}
				<nav className='space-y-4 font-medium'>
					<NavLink
						onClick={() => toggleSidebar()}
						to='admin-users'
						className={({ isActive }) =>
							isActive
								? 'block p-3 rounded-lg bg-system-primary-accent text-system-secondary-bg'
								: 'block p-3 rounded-lg hover:bg-system-primary-accent-light hover:text-system-primary-text transition duration-200'
						}>
						Admin Users
					</NavLink>

					<NavLink
						onClick={() => toggleSidebar()}
						to='tags'
						className={({ isActive }) =>
							isActive
								? 'block p-3 rounded-lg bg-system-primary-accent text-system-secondary-bg'
								: 'block p-3 rounded-lg hover:bg-system-primary-accent-light hover:text-system-primary-text transition duration-200'
						}>
						Tags
					</NavLink>

					<NavLink
						onClick={() => toggleSidebar()}
						to='content-reports'
						className={({ isActive }) =>
							isActive
								? 'block p-3 rounded-lg bg-system-primary-accent text-system-secondary-bg'
								: 'block p-3 rounded-lg hover:bg-system-primary-accent-light hover:text-system-primary-text transition duration-200'
						}>
						Content Reports
					</NavLink>
				</nav>
			</div>
		</>
	)
}

export default SuperadminSidebar
