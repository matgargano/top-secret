import LinksLinks from "csc-start/components/LinksLinks";
import SocialLinks from "csc-start/components/SocialLinks";
import {
  getLinksLinks,
  getSocialLinks,
  getUserIdBySlug,
} from "csc-start/utils/data";
import { notFound } from "next/navigation";

const Page = async ({ params: { slug } }) => {
  const { data, error } = await getUserIdBySlug(slug);
  if (!data) {
    notFound();
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  const { user_id } = data;

  const socialLinks = await getSocialLinks(user_id);
  const linksLinks = await getLinksLinks(user_id);

  return (
    <div className="barge">
      <SocialLinks links={socialLinks} />
      <LinksLinks links={linksLinks} />
    </div>
  );
};

export default Page;
