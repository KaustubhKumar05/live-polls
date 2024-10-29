import { LoaderPinwheelIcon } from "lucide-react";
import React from "react";

export const FullPageLoader = () => (
  <div className="w-full h-screen flex justify-center items-center fixed top-0 left-0 bg-slate-900">
    <LoaderPinwheelIcon size={48} className="text-orange-400 animate-spin" />
  </div>
);
