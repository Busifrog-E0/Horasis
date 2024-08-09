import { useNavigate } from "react-router-dom";

const AlertContent = ({Content,ContentLinks}) => {
  const navigate = useNavigate()


  const replaceWithLinks = (content, links) => {
    if(!content || !links) return "no content"
    return content.split(/(@[^@]+@)/g).map((part, index) => {
      const match = part.match(/@([^@]+)@/);
      if (match) {
        const text = match[1];
        const linkObject = links.find(link => link.Text === text);
        if (linkObject) {
          return (
            <a key={index} onClick={(e)=>{
              e.stopPropagation()
              navigate(linkObject.Link)}}
              className="text-system-primary-accent cursor-pointer bg-system-primary-accent-light px-1 rounded-md text-sm hover:text-system-primary-accent-transparent hover:underline"
            >
              {linkObject.Text}
            </a>
          );
        }
      }
      return part; // Return the part as is if no match is found
    });
  };

	return <>{replaceWithLinks(Content, ContentLinks)}</>
}

export default AlertContent
