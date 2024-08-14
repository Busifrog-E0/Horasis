import { useNavigate } from 'react-router-dom'
import TodaysEventTab from '../components/Events/TodaysEventTab'
import RecentlyActiveMemebrsTab from '../components/Members/RecentlyActiveMemebrsTab'
import CurrentProfileTab from '../components/Profile/CurrentProfileTab'
import DropdownMenu from '../components/ui/DropdownMenu'
import { relativeTime } from '../utils/date'
import SearchBar from '../components/SearchBar'
import InsightsList from '../components/Insights/InsightsList'
import SearchComponent from '../components/Search/SearchBox/SearchComponent'
import addIcon from '../assets/icons/add-icon.svg'
import ArticlesSection from '../components/Articles/ArticlesSection'

const Articles = () => {
	const navigate = useNavigate()
	const OnClickCreateNew = (path) => {
		navigate(path)
	}
	return (
		<>
			<div className='absolute z-10 right-0 bottom-16 lg:bottom-0 p-10 px-14'>
				<div
					onClick={() => OnClickCreateNew('/Articles/Create/New')}
					className='h-16 w-16 cursor-pointer shadow-lg bg-system-primary-btn p-4 rounded-full'>
					<img src={addIcon} alt='' />
				</div>
			</div>
			<div className='p-2 lg:px-10 lg:py-6'>
				<div className='grid lg:grid-cols-4 gap-3 lg:gap-12'>
					<div className='hidden lg:block'>
						<CurrentProfileTab />
						<h4 className='font-medium text-xl text-system-primary-text mt-3 lg:mt-5'>Today's Event</h4>
						<TodaysEventTab />
						<div className='p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5'>
							<h4 className='font-medium text-md text-system-primary-text mb-4'>Recently Active Members</h4>
							<RecentlyActiveMemebrsTab />
						</div>
					</div>
					<div className='lg:col-span-3'>
						<ArticlesSection />
					</div>
				</div>
			</div>
		</>
	)
}

export default Articles
