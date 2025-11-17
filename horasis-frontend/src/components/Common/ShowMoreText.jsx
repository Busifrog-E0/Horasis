import { useState } from 'react';

const ShowMoreText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (text.length <= maxLength) {
    return <p className="text-md text-system-secondary-text my-4 leading-relaxed whitespace-pre-line">{text}</p>;
  }

  const displayedText = isExpanded ? text : text.substring(0, maxLength) + '...';

  return (
    <div>
      <p className="text-md text-system-secondary-text my-4 leading-relaxed whitespace-pre-line">
        {displayedText}
      </p>
      <button onClick={toggleExpanded} className="text-sm text-system-primary-accent hover:underline">
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ShowMoreText;