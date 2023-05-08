"use client";
import { useEffect } from "react";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";

const useUserMustBeLoggedOut = (url = "/") => {
  const { fullyLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!!fullyLoaded && !!user) {
      router.push(url);
    }
  }, [fullyLoaded, router, url, user]);
};

export default useUserMustBeLoggedOut;
