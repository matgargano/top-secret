"use client";
import useUser from "csc-start/app/hooks/useUser";
import Link from "next/link";
import Skeleton from "./Skeleton";

const FooterAdminLinks = () => {
  const { user, fullyLoaded } = useUser();

  return (
    <div className="mt-5 small flex gap-5 justify-center w-full">
      {!fullyLoaded && <Skeleton />}
      {!!fullyLoaded && !user && (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
      {!!fullyLoaded && !!user && (
        <>
          <Link href="/profile">Profile</Link>
          <Link href="/logout">Logout</Link>
        </>
      )}
    </div>
  );
};
export default FooterAdminLinks;
