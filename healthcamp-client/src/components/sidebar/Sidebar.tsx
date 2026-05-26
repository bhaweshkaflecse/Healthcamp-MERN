import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import style from "./Sidebar.module.css";
import { IoHome } from "react-icons/io5";
import { MdPeopleOutline } from "react-icons/md";
import { MdOutlineEventNote } from "react-icons/md";
import { TbPackages } from "react-icons/tb";
import { HiDocumentReport } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { clientinfo } from "../../api/auth";
import ErrorAxios from "../ErrorAxios";


const Sidebar = () => {
  const [kycState, setKycState] = useState(true);

  const { isLoading, data, error } = useQuery({
    queryKey: ["KycPending"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(clientinfo, {});
      return response.data;
    },
  });
  if (isLoading) {
    <div>loading...</div>;
  }
  if (error) {
    <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  useEffect(() => {
    if (data) {
      if (data?.kyc?.kycStatus === "approved") {
        setKycState(false);
      }
    }
  }, [data]);

  const [openChildren, setOpenChildren] = useState<{ [key: string]: boolean }>(
    {}
  );
  const location = useLocation();
  const navigate = useNavigate();

  const route = [
    {
      Name: "Dashboard",
      Icon: <IoHome />,
      path: "/dashboard",
    },
    {
      Name: "Packages",
      Icon: <TbPackages />,
      path: "/packages",
    },
    {
      Name: "Events",
      Icon: <MdOutlineEventNote />,
      path: "/events",
    },
    {
      Name: "Report",
      Icon: <HiDocumentReport />,
      path: "/report",
    },
    // {
    //   Name: "KYC Status",
    //   Icon: <FaRegAddressBook />,
    //   path: "kyc",
    // },
    {
      Name: "Participants Details",
      Icon: <MdPeopleOutline />,
      path: "/participants",
    },
  ];
  const toggleChild = (name: string) => {
    setOpenChildren((prevState) => ({
      prevState: false,
      [name]: !prevState[name],
    }));
  };
  return (
    <>
      <ul className={style.parent}>
        {route.map((item, index) => (
          <li
            key={index}
            className={`${
              location.pathname !== item.path ? "" : style.activeParent
            } 
                ${openChildren[item.Name] ? style.children2 : style.children}
                `}
          >
            <main 
             style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              pointerEvents: kycState ? "none" : "auto", 
              opacity: kycState ? 0.5 : 1, 
              cursor: kycState ? "not-allowed" : "pointer",
            }}
              onClick={() => {

                if (kycState) return;

                if (item.path !== null) {
                  navigate(item.path);
                } else {
                  toggleChild(item.Name);
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
                
              >
                {item.Icon && item.Icon}
                {item.Name}
              </div>
              {/* {item.children && (
                  <IoIosArrowForward
                    color="black"
                    style={{ transition: "0.3s ease" }}
                    className={openChildren[item.Name] ? style.rotateArrow : ""}
                  />
                )} */}
            </main>
            {/* <ul className={style.nested}>
                {item.children?.map((child, childIndex) => (
                  <li
                    key={childIndex}
                    className={
                      location.pathname === child.path ? style.activeSub : ""
                    }
                  >
                    <main onClick={() => navigate(child.path)}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        {child.Name}
                      </div>
                    </main>
                  </li>
                ))}
              </ul> */}
          </li>
        ))}
      </ul>
    </>
    // </nav>
  );
};

export default Sidebar;
