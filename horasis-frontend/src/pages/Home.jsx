import HeroSection from '../components/Home/HeroSection'
import HomeHeader from '../components/Home/HomeHeader'
import city from '../assets/tempimages/city.jpg'
import HeroCoverImage from '../assets/images/hero-cover-image.png'
import HomeMidSection from '../components/Home/HomeMidSection'
import HomeUpcomingEvents from '../components/Home/HomeUpcomingEvents'
import HomeDiscussionsSection from '../components/Home/HomeDiscussionsSection'
import HomeFooter from '../components/Home/HomeFooter'
import { useEffect, useRef } from 'react'
const Home = () => {
	const discussionRef = useRef()
	const eventsRef = useRef()
	const contactRef = useRef()
	const moveToDiscussions = () => discussionRef.current.scrollIntoView({ behavior: 'smooth' })
	const moveToEvents = () => eventsRef.current.scrollIntoView({ behavior: 'smooth' })
	const moveToContacts = () => contactRef.current.scrollIntoView({ behavior: 'smooth' })

	return (
		<div>
			<div style={{ backgroundImage: `url(${HeroCoverImage})` }} className='bg-cover bg-no-repeat'>
				<HomeHeader moveToDiscussions={moveToDiscussions} moveToEvents={moveToEvents} moveToContacts={moveToContacts} />
				<HeroSection />
			</div>
			<HomeMidSection />
			<HomeUpcomingEvents ref={eventsRef} />
			<HomeDiscussionsSection ref={discussionRef} />
			<HomeFooter ref={contactRef} />
		</div>
	)
}

export default Home
