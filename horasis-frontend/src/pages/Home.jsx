import HeroSection from '../components/Home/HeroSection'
import HomeHeader from '../components/Home/HomeHeader'
import city from '../assets/tempimages/city.jpg'
import HomeMidSection from '../components/Home/HomeMidSection'
import HomeUpcomingEvents from '../components/Home/HomeUpcomingEvents'
import HomeDiscussionsSection from '../components/Home/HomeDiscussionsSection'
const Home = () => {
	return (
		<div>
			<div style={{ backgroundImage: `url(${city})` }} className='bg-cover bg-no-repeat'>
				<HomeHeader />
				<HeroSection />
			</div>
			<HomeMidSection />
			<HomeUpcomingEvents />
			<HomeDiscussionsSection />
		</div>
	)
}

export default Home
