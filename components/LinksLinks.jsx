import { getLinksLinks } from "csc-start/utils/data";

const links = getLinksLinks();

const LinksLinks = () => {
  return (
    <div className="barge flex flex-col gap-[24px] pb-[60px]">
      {(!Array.isArray(links) || links.length === 0) && (
        <p>No Additional Links Added, Check Back!</p>
      )}
      {Array.isArray(links) &&
        links.length > 0 &&
        links.map(({ id, title, url }) => {
          return (
            <a
              key={id}
              title={title}
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              className="button"
            >
              {title}
            </a>
          );
        })}
    </div>
  );
};

export default LinksLinks;
