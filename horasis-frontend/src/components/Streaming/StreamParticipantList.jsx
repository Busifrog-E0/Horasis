import { useState } from "react";
import avatar from "../../assets/icons/avatar.svg";
const StreamParticipantList = ({ remoteUsers }) => {
  const [activeTab, setActiveTab] = useState("participants");

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 bg-system-primary-accent-dim shadow-lg rounded-lg">
      <div className="flex gap-10">
        <p
          className={`text-brand-secondary`}
          onClick={() => setActiveTab("participants")}
        >
          Participants{" "}
        </p>
        {/* <p
          className={`text-gray-100 cursor-pointer ${activeTab === 'participants' && 'bg-blue-600'} p-4 rounded-md`}
          onClick={() => setActiveTab("participants")}
        >
          Participants{" "}
        </p>
        <p className={`text-gray-100 cursor-pointer ${activeTab === 'messages' && 'bg-blue-600'} p-4 rounded-md`} onClick={() => setActiveTab("messages")}>
          Messages{" "}
        </p> */}
      </div>
      <hr className="my-3" />
      {activeTab === "participants" && (
        <div className="overflow-auto flex-1 flex-grow-1 w-full">
          <div className=" grid grid-cols-3 bg-[#D6D3E3] text-brand-primary p-5 rounded-lg gap-6 ">
            <div >
              <img src={avatar} alt="" className="h-20" />
              <p className="text-center truncate">{"You"}</p>
            </div>
            {remoteUsers.map((user) => (
              <div key={user.uid}>
                <img src={avatar} alt="" className="h-20" />
                <p className="text-center truncate">{user.uid}</p>
              </div>
            ))}

          </div>
        </div>
      )}
      {activeTab === "messages" && <div>messages section</div>}
    </div>
  );
};

export default StreamParticipantList;
