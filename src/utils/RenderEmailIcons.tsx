import React from "react";
import { NavLink } from "react-router-dom";
import { CiMail } from "react-icons/ci";

interface RenderEmailIconProps {
  classId: number;
  isAllEmailSent: boolean;
}

const renderEmailIcon: React.FC<RenderEmailIconProps> = ({ classId, isAllEmailSent }) => {
  return isAllEmailSent ? (
    <span className="bg-gray-200 p-2 rounded-full text-gray-500">
      <CiMail className="h-5 w-5" />
    </span>
  ) : (
    <NavLink
      to={`/send-email/${classId}`}
      className="bg-blue-200 p-2 rounded-full text-blue-600 hover:bg-blue-300"
    >
      <CiMail className="h-5 w-5" />
    </NavLink>
  );
};

export default renderEmailIcon;
