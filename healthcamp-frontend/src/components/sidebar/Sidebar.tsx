import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./Sidebar.module.css";
import { IoCall, IoHome, IoSettings } from "react-icons/io5";
import { FaCalendarAlt, FaShoppingBag, FaUsers } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";
import { IoMdPhotos } from "react-icons/io";
import { PiArrowSquareDownLeftFill } from "react-icons/pi";
import { VscListSelection } from "react-icons/vsc";
import { FiPackage } from "react-icons/fi";
import { MdLeaderboard } from "react-icons/md";
import { GrGroup } from "react-icons/gr";

import {
  FaMoneyCheckDollar,
  FaPeopleLine,
  FaSquareCheck,
} from "react-icons/fa6";
import useAuthStore from "../../providers/context/useAuthStore";

const Sidebar = () => {
  const [, setOpenChildren] = useState<{ [key: string]: boolean }>({});
  const { role } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const getRoutesForRole = () => {
    switch (role) {
      case "business_head":
        return [
          { Name: "Dashboard", Icon: <IoHome size={20} />, path: "/dashboard" },
          {
            Name: "Service",
            Icon: <FaShoppingBag size={20} />,
            path: "/services",
          },
          {
            Name: "Package",
            Icon: <BiSolidPackage size={20} />,
            path: "/package",
          },
          {
            Name: "Role Management",
            Icon: <FaSquareCheck size={20} />,
            path: "/role",
          },
          { Name: "Clients", Icon: <FaUsers size={20} />, path: "/client" },
          {
            Name: "Finance",
            Icon: <FaMoneyCheckDollar size={20} />,
            path: "/finance",
          },
          {
            Name: "Carousel",
            Icon: <IoMdPhotos size={20} />,
            path: "/carousel",
          },
        ];
      case "team_lead":
        return [
          {
            Name: "Dashboard",
            Icon: <IoHome size={20} />,
            path: "/dashboard",
          },
          { Name: "Clients", Icon: <FaUsers size={20} />, path: "/myclients" },
          {
            Name: "Package Request",
            Icon: <BiSolidPackage size={20} />,
            path: "/package-request",
          },
          {
            Name: "Event Booking",
            Icon: <PiArrowSquareDownLeftFill size={20} />,
            path: "/book-event",
          },
          {
            Name: "Kyc Status",
            Icon: <FaSquareCheck size={18} />,
            path: "/team-kyc",
          },
          { Name: "Teams", Icon: <FaPeopleLine size={22} />, path: "/teams" },
          {
            Name: "Calendar",
            Icon: <FaCalendarAlt size={18} />,
            path: "/calander",
          },
        ];
      case "finance":
        return [
          { Name: "Dashboard", Icon: <IoHome />, path: "/dashboard" },

          {
            Name: "History",
            Icon: <FiPackage />,
            path: "/finance-client",
          },
          { Name: "Settings", Icon: <IoSettings />, path: "/settings" },
        ];
      case "data_entry":
        return [
          {
            Name: "Dashboard",
            Icon: <IoHome />,
            path: "/data-entry-dashboard",
          },
          {
            Name: "Settings",
            Icon: <IoSettings />,
            path: "/settings",
          },
        ];
      case "call_centre":
        return [
          { Name: "Dashboard", Icon: <IoHome />, path: "/call-center" },
          { Name: "Add Call Log", Icon: <IoCall />, path: "/data-log" },

          { Name: "Settings", Icon: <IoSettings />, path: "/settings" },
        ];
      case "unit_coordinator":
        return [
          { Name: "Events", Icon: <IoCall />, path: "/assigned-events" },
          { Name: "Team", Icon: <GrGroup />, path: "/my-team" },
          { Name: "Settings", Icon: <IoSettings />, path: "/settings" },
         
        ];
        case "IT_team":
        return [
          { Name: "Dashboard", Icon: <IoHome />, path: "/it-dashboard" },

          { Name: "Settings", Icon: <IoSettings />, path: "/settings" },
        ];
        case "sales":
          return [
            { Name: "Client Lists", Icon: <VscListSelection />, path: "/clients-list" },
  
            {
              Name: "Lead Details",
              Icon: <MdLeaderboard />,
              path: "/lead-details",
            },
            { Name: "Settings", Icon: <IoSettings />, path: "/settings" },
          ];
      default:
        return [];
    }
  };

  const toggleChild = (name: string) => {
    setOpenChildren((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const routes = role ? getRoutesForRole() : [];

  return (
    <nav>
      <ul className={style.parent}>
        {routes.map((item, index) => (
          <li
            key={index}
            className={`${
              location.pathname === item.path ? style.activeParent : ""
            }`}
          >
            <main
              onClick={() => {
                if (item.path) navigate(item.path);
                else toggleChild(item.Name);
              }}
            >
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                {item.Icon}
                {item.Name}
              </div>
            </main>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
