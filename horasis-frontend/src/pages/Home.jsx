import { useRef } from 'react'
import HeroCoverImage from '../assets/images/hero-cover-image.webp'
import HeroSection from '../components/Home/HeroSection'
import HomeDiscussionsSection from '../components/Home/HomeDiscussionsSection'
import HomeFooter from '../components/Home/HomeFooter'
import HomeHeader from '../components/Home/HomeHeader'
import HomeMidSection from '../components/Home/HomeMidSection'
import HomeUpcomingEvents from '../components/Home/HomeUpcomingEvents'
import HomeMilestones from '../components/Home/HomeMilestones'
import HomeAboutFounder from '../components/Home/HomeAboutFounder'
const Home = () => {
	const discussionRef = useRef()
	const eventsRef = useRef()
	const contactRef = useRef()
	const moveToDiscussions = () => discussionRef.current.scrollIntoView({ behavior: 'smooth' })
	const moveToEvents = () => eventsRef.current.scrollIntoView({ behavior: 'smooth' })
	const moveToContacts = () => contactRef.current.scrollIntoView({ behavior: 'smooth' })

	return (
		<div>
			<div style={{
				backgroundImage: `url(${HeroCoverImage})`
			}} className='bg-cover bg-no-repeat'>
				<HomeHeader moveToDiscussions={moveToDiscussions} moveToEvents={moveToEvents} moveToContacts={moveToContacts} />
				<HeroSection />
			</div>
			<HomeMidSection />
			{/* <HomeMilestones /> */}

			<HomeAboutFounder />
			<HomeUpcomingEvents ref={eventsRef} />
			<HomeDiscussionsSection ref={discussionRef} />
			<HomeFooter ref={contactRef} />
		</div>
	)
}

export default Home
