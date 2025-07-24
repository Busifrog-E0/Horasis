import React from 'react'
import { useNavigate } from 'react-router-dom'
import FounderImage from '../../assets/images/home/founder.jpg'

const HomeAboutFounder = () => {
	const navigate = useNavigate()

	return (
		<section className='py-16 bg-white flex items-center justify-center'>
			<div className='px-6 max-w-screen-2xl w-full flex items-center justify-center'>
				{/* Image */}
				<div className='grid grid-cols-1 lg:grid-cols-2 items-center  gap-10 w-11/12 md:w-9/12'>
					<div className='bg-system-secondary-bg  w-full h-full lg:max-w-96 rounded-md flex flex-col items-center justify-center gap-4'>
						<img
							src={FounderImage}
							alt='Frank-Jürgen Richter'
							className='h-64 w-64 md:w-96 md:h-96 lg:w-auto lg:h-auto aspect-square rounded-[5rem] object-cover'
						/>
					</div>

					{/* Content */}
					<div className='bg-system-secondary-bg w-full  rounded-md  flex flex-col gap-4'>
						<h2 className='text-3xl font-bold text-gray-800 '>Frank-Jürgen Richter</h2>
						<p className='text-primary-accent mb-2 italic'>Chairman &amp; Founder, Horasis</p>
						<p className='text-gray-700 mb-4'>
							Frank-Jürgen Richter founded Horasis in 2005 after serving as Director of the World Economic Forum
							(2001–2004), where he led the Forum’s Asian initiatives and elevated regional summits into premier
							platforms for cross-continental dialogue. An acclaimed author and speaker, Richter has written extensively
							on global strategy, economic development, and the future of leadership.
						</p>
						<p className='text-gray-700 mb-6'>
							Under his guidance, Horasis has become a worldwide community of visionaries, focusing on sustainable and
							equitable growth, especially within the Global South. Richter’s commitment to bold, honest dialogue and
							lasting solutions drives every Horasis summit and collaboration.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomeAboutFounder
