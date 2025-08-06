import heroImage from '../../assets/images/home/B4.jpg'
const HeroSection = () => {
	const handleClick = (e, id) => {
		e.preventDefault()
		document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
	return (
		<div className="h-screen flex items-center justify-center overflow-hidden relative">
			<div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
				{/* Left Side */}
				<div className="flex flex-col gap-10 justify-center order-last md:order-first px-4 sm:px-8 md:px-16 lg:px-20 bg-system-primary-accent-transparent">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<h4 className="font-bold text-6xl text-system-secondary-bg">Horasis</h4>
							<h4 className="text-xl md:text-2xl text-system-secondary-bg">Global Visions Community</h4>
						</div>
						<h4 className="text-base md:text-md text-system-secondary-bg md:w-4/5 lg:w-2/3">
							Horasis exists to unite visionary leaders from government, business and civil society in pursuit of a single goal: forging a more sustainable, equitable and prosperous world. Through boundary‑transcending dialogue and action, we lay the groundwork for decisions today that safeguard our shared tomorrow.
						</h4>
					</div>
					<div className="flex flex-row flex-wrap gap-6">
						<div className="rounded-full p-4 px-12 border border-system-secondary-bg bg-system-secondary-bg">
							<p
								className="text-system-primary-accent text-xl font-bold cursor-pointer"
								onClick={(e) => handleClick(e, 'about-us')}
							>
								Learn More
							</p>
						</div>
					</div>
				</div>

				{/* Right Side */}
				<div className="w-full h-full relative">
					<img
						src={heroImage}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>

	)
}

export default HeroSection
