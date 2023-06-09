import Image from "next/image";
import { getCurrentUser } from "../utils/data";

const { name, avatar } = getCurrentUser();

const TopContent = () => {
  return (
    <div className="barge flex flex-col items-center pt-14">
      {avatar && (
        <Image
          src={avatar}
          height="145"
          width="145"
          alt={name}
          className="rounded-full"
        />
      )}
      <div className="h1">{name}</div>
    </div>
  );
};

export default TopContent;
