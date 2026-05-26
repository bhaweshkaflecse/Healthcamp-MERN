// import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
// import style from "./Sidebar.module.css";
// import { Image } from "@mantine/core";
// import { FaCalendar } from "react-icons/fa";

// const ClientSidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const route = [
//     {
//       Name: "Dashboard",
//       Icon: <Image src='icon/Chart 2.png' />,
//       path: "/clientdashboard",
//     },
//     {
//       Name: "Packages",
//       Icon: <Image src='icon/clientpackage.png'/>,
//       path: "clientpackage",
//     },
//     {
//       Name: "My Packages",
//       Icon:  <Image w={18} src='icon/credit-card.png'/>,
//       path: "packageplan",
//     },
//     {
//       Name: "Event Calendar",
//       Icon: <FaCalendar color="#878787" />,
//       path: "calander",
//     },
//     {
//       Name: "Report Analysis",
//       Icon: <Image src='icon/Vector (1).png' />,
//       path: "report",
//     },
//     {
//       Name: "Settings",
//       Icon: <Image src='icon/setting.3.png'/>,
//       path: "setting",
//     },
//   ];
//   return (
//     <>
//       <div>
//         <ul className={style.parent}>
//           {route.map((item, index) => (
//             <li
//               key={index}
//               className={
//                 location.pathname !== item.path ? "" : style.activeParent
//               }
//               onClick={() => navigate(item.path)}
//             >
//               <main>
//                 <div
//                   style={{
//                     textWrap:"nowrap",
//                     display: "flex",
//                     gap: "10px",
//                     alignItems: "center",
//                   }}
//                 >
//                   {item.Icon && item.Icon}
//                   {item.Name}
//                 </div>
//               </main>
//               <ul className={style.nested}></ul>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default ClientSidebar;
