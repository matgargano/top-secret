"use client";

import Profile from "csc-start/components/Profile";
import { useState } from "react";

const Page = () => {
  const [tab, setTab] = useState("social");

  return (
    <div className="barge">
      <div className="flex justify-around my-5 w-full items-center">
        <p>Choose Links to Edit</p>
        <button
          disabled={tab === "social"}
          className={`button small `}
          onClick={() => setTab("social")}
        >
          Social
        </button>
        <button
          disabled={tab === "links"}
          className={`button small`}
          onClick={() => setTab("links")}
        >
          Links
        </button>
      </div>
      {tab === "social" && <Profile type="social" />}
      {tab === "links" && <Profile type="link" />}
    </div>
  );
};

export default Page;
