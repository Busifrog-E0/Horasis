import { useState, useEffect } from 'react'

const useCountdown = (startTime, endTime) => {
	const [timeLeft, setTimeLeft] = useState(null)

	useEffect(() => {
		const updateTimer = () => {
			const currentTime = new Date().getTime()

			if (currentTime < startTime) {
				setTimeLeft(startTime - currentTime) // Countdown to event start
			} else if (currentTime < endTime) {
				setTimeLeft(endTime - currentTime) // Countdown to event end
			} else {
				setTimeLeft(0) // Event has ended
			}
		}

		const interval = setInterval(updateTimer, 1000)
		updateTimer() // Run it once immediately to avoid delay

		return () => clearInterval(interval) // Clean up the interval on component unmount
	}, [startTime, endTime])

	const formatTime = (milliseconds) => {
		const totalSeconds = Math.floor(milliseconds / 1000)
		const days = Math.floor(totalSeconds / (3600 * 24))
		const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		return `${days}d ${hours}h ${minutes}m ${seconds}s`
	}

	return {
		timeLeft,
		formattedTime: timeLeft > 0 ? formatTime(timeLeft) : 'Event has ended',
	}
}

export default useCountdown
