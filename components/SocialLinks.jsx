import { getSocialLinks } from "csc-start/utils/data";
import Facebook from "../images/facebook.svg";
import Snapchat from "../images/snapchat.svg";
import Twitter from "../images/twitter.svg";
import Instagram from "../images/instagram.svg";
import Image from "next/image";

const getIcon = (title) => {
  switch (title) {
    case "Facebook":
      return Facebook;
    case "Twitter":
      return Twitter;
    case "Snapchat":
      return Snapchat;
    case "Instagram":
      return Instagram;
  }
};

const SocialLinks = ({ links }) => {
  return (
    <div className="barge flex gap-[24px] py-[60px] justify-center gap-[43px] items-center flex">
      {(!Array.isArray(links) || links.length === 0) && (
        <p>No Social Links Added, Check Back!</p>
      )}
      {Array.isArray(links) &&
        links.length > 0 &&
        links.map(({ id, title, url }) => {
          const icon = getIcon(title);
          return (
            <a
              key={id}
              title={title}
              target="_blank"
              rel="noopener noreferrer"
              href={url}
            >
              <Image src={icon} height="46" width="46" alt={title} />
            </a>
          );
        })}
    </div>
  );
};

export default SocialLinks;
