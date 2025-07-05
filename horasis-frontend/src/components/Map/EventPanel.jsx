
export default function EventPanel({
  events,
  selectedZone,
  selectedEvent,
  zones,
  onEventSelect,
  onZoneSelect
}) {
  const filteredEvents = selectedZone
    ? events.filter(event => event.zone === selectedZone)
    : events;

  const selectedZoneData = zones.find(zone => zone.id === selectedZone);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (selectedEvent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-3 h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">  {selectedEvent.location + ", " + selectedEvent.country.name}</h2>
          </div>
          <button
            onClick={() => onEventSelect(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            {/* <X className="w-5 h-5 text-gray-500" /> */}
          </button>
        </div>

        {
          selectedEvent.goals && selectedEvent.goals.length > 0 &&
          (


            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${'bg-green-100 text-green-800'}`}>
                  {"Goals"}
                </span>
                <ul className="flex flex-col gap-2">
                  {
                    selectedEvent.goals.map((goal, index) => (
                      <li key={index} >
                        {<h3 className=" text-gray-900 transition-colors duration-200">
                          {goal}
                        </h3>}
                      </li>))
                  }
                </ul>
              </div>
              <button
                onClick={() => onEventSelect(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {/* <X className="w-5 h-5 text-gray-500" /> */}
              </button>
            </div>
          )
        }

        {
          selectedEvent.challenges && selectedEvent.challenges.length > 0 && (
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${'bg-purple-100 text-purple-800'}`}>
                  {"Challenges"}
                </span>
                <ul className="flex flex-col gap-2">
                  {
                    selectedEvent.challenges.map((goal, index) => (
                      <li key={index} >
                        {<h3 className=" text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {goal}
                        </h3>}
                      </li>))
                  }
                </ul>
              </div>
              <button
                onClick={() => onEventSelect(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {/* <X className="w-5 h-5 text-gray-500" /> */}
              </button>
            </div>
          )
        }

        <div className="flex space-x-3">
          <button
            onClick={() => onEventSelect(null)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedZone ? selectedZoneData?.name : 'Global Events'}
          </h2>
          {selectedZoneData && (
            <p className="text-gray-600 mt-1">{selectedZoneData.description}</p>
          )}
        </div>
        {selectedZone && (
          <button
            onClick={() => onZoneSelect(null)}
            className="px-4   whitespace-nowrap py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            Show All
          </button>
        )}
      </div>
      {
        selectedZoneData && (
          <div className="mb-3">
            <div className="flex  items-start ">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0" >
                <img src={selectedZoneData.head.imageUrl} alt={selectedZoneData.head.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-600 m-0">
                  {selectedZoneData.head.name}
                </p>
                <p className="text-xs text-gray-600 m-0">
                  {selectedZoneData.head.description}
                </p>
              </div>
            </div>
          </div>

        )
      }

      <div className="">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event)}
            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {/* <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-500">{"TEst"}</span>
                </div> */}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {event.location + ", " + event.country.name}
                </h3>
              </div>
            </div>
            {
              event.goals && event.goals.length > 0 && (
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${'bg-green-100 text-green-800'}`}>
                        {"Goals"}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {
                        event.goals.map((goal, index) => (
                          <li key={index} >
                            {<h3 className=" text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {goal}
                            </h3>}
                          </li>))
                      }
                    </ul>
                  </div>
                </div>
              )
            }

            {
              event.challenges && event.challenges.length > 0 && (
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${'bg-purple-100 text-purple-800'}`}>
                        {"Challenges"}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {
                        event.challenges.map((goal, index) => (
                          <li key={index} >
                            {<h3 className=" text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {goal}
                            </h3>}
                          </li>))
                      }
                    </ul>
                  </div>
                </div>
              )
            }
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No data Found</h3>
          <p className="text-gray-600">There are no data in the selected region.</p>
        </div>
      )}
    </div>
  );
}