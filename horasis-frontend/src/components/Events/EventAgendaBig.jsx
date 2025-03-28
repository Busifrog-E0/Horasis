import { useState, useEffect } from 'react'
import { gettimenow } from '../../utils/date'
import avatar from '../../assets/icons/avatar.svg'
import location from '../../assets/icons/location.svg'

const EventsAgendaBig = ({ event }) => {
  const [agendas, setAgendas] = useState([])

  useEffect(() => {
    if (event?.Agenda) {
      setAgendas(event.Agenda)
    }
  }, [event])

  return (
    <div className="relative flex flex-col items-center px-8 max-w-5xl mx-auto">
      {/*
        Absolute vertical line:
        - Positioned in the center horizontally (left-1/2 -translate-x-1/2).
        - top-12 / bottom-12 so it starts/ends near the dot centers.
      */}
      <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-[2px] bg-system-primary-accent" />

      {/*
        Wrap agenda items in a vertical stack:
        - space-y-20 for extra vertical spacing between items (20 = 5rem).
      */}
      <div className="flex flex-col w-full space-y-36">
        {agendas.map((agenda, index) => (
          <div key={index} className="relative flex w-full items-center">
            {/* -- LEFT SIDE: Time & Location -- */}
            <div className="w-1/2 pr-8 text-right">
              <time className="block mb-2 text-lg font-semibold text-system-primary-text">
                {gettimenow(new Date(agenda.StartTime))}
              </time>
              <div className="flex justify-end items-center gap-2">
                <img
                  className="w-5 h-5 object-contain"
                  src={location}
                  alt="Location icon"
                />
                <span className="text-base font-medium text-system-primary-text">
                  {agenda?.Location}
                </span>
              </div>
            </div>

            {/* -- TIMELINE DOT -- */}
            <div className="relative z-10 w-8 h-8 -mx-4 flex items-center justify-center">
              {/*
                Circle "dot":
                - White background so the line behind it doesn't overlap.
                - Thick border for emphasis.
              */}
              <div className="w-6 h-6 bg-white border-4 border-system-primary-accent rounded-full" />
            </div>

            {/* -- RIGHT SIDE: Agenda & Speaker Info -- */}
            <div className="w-1/2 pl-8">
              <h3 className="text-lg font-semibold text-system-primary-text mb-2">
                {agenda.Name}
              </h3>

              {agenda?.SpeakerData?.UserDetails?.FullName && (
                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={
                      agenda?.SpeakerData?.UserDetails?.ProfilePicture ||
                      avatar
                    }
                    alt="Speaker avatar"
                  />
                  <p className="text-base font-medium text-system-primary-accent">
                    {agenda?.SpeakerData?.UserDetails?.FullName}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsAgendaBig
