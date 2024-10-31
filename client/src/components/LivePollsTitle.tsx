import { LoaderPinwheel } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const LivePollsTitle = () => (
  <Link to="/">
    <h1 className="text-white flex gap-2 font-bold text-2xl items-center cursor-pointer">
      <LoaderPinwheel size={28} /> Live Polls
    </h1>
  </Link>
);
