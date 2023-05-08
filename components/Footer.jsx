import Image from "next/image";
import cargoBlack from "../images/cargo-black.svg";
import FooterAdminLinks from "./FooterAdminLinks";

const Footer = () => {
  return (
    <footer className="barge ">
      <div className="flex justify-between items-center">
        <p className="h2">Copyright 2023</p>
        <Image src={cargoBlack} alt="LinkBarge" width={44} height={37} />
      </div>
      <div className="flex gap-5">
        <FooterAdminLinks />
      </div>
    </footer>
  );
};

export default Footer;
