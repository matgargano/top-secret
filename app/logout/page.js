"use client";

import { logout } from "csc-start/utils/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const logoutInner = async () => {
      const error = await logout();
      router.replace("/");
    };
    logoutInner();
  }, [router]);

  return <p className="barge">Logging out...</p>;
};

export default Page;
