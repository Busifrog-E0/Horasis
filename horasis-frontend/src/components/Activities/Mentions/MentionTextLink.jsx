const MentionTextLink = ({ singleActivity }) => {

    function parseContent() {
        const content = singleActivity.Content;
        const mentions = singleActivity.Mentions;
        const parts = content.split(/(\s+)/); // Split by spaces, keeping the spaces

        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                const username = part.substring(1); // Remove the '@' character
                const mention = mentions.find(m => m.Username === username);
                if (mention) {
                    return (
                        <a key={index} href={`/ViewProfile/${mention.UserId}`} className="text-system-primary-accent">
                            {mention.FullName}
                        </a>
                    );
                }
            }
            return <span key={index}>{part}</span>;
        });
    }
    //     <div className="inline-flex flex-row items-center flex-wrap gap-2 px-2 bg-brand-yellow-transparent ">
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 -960 960 960" >
    //         <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
    //     </svg>
    //     <a key={index} href={`/ViewProfile/${mention.UserId}`} className="text-brand-primary">
    //         {mention.FullName}
    //     </a>
    // </div>


    return (
        <h4 className='text-system-primary-text font-medium text-xl'>{parseContent(singleActivity)}</h4>
    )
}

export default MentionTextLink