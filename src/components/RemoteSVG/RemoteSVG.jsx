import React, { useEffect, useState } from "react";

const RemoteSVG = ({ url }) => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setSvgContent)
      .catch(console.error);
  }, [url]);

  return (
    <div
      className="w-12 h-12 overflow-hidden"
      dangerouslySetInnerHTML={{ __html: svgContent || "" }}
    />
  );
};

export default RemoteSVG;
