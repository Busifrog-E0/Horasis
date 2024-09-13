import { useEffect, useRef } from 'react'

const TimerComponent = ({ timerValue, setTimerValue }) => {
	const intervalRef = useRef(null)

	const setTimer = () => {
		return setInterval(() => {
			setTimerValue((prevTimerValue) => prevTimerValue - 1)
		}, 1000)
	}

	useEffect(() => {
		intervalRef.current = setTimer()

		return () => clearInterval(intervalRef.current)
	}, [])

	useEffect(() => {
		if (timerValue === 0) {
			clearInterval(intervalRef.current)
		}
	}, [timerValue])

	return (
		<div>
			<p>You can resend an otp in {timerValue}s</p>
		</div>
	)
}

export default TimerComponent
