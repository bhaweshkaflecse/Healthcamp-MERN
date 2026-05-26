// import { useEffect, useState } from 'react';
// import { Image } from "@mantine/core";
// // import { useGlobalContext } from '../../providers/context';

// const RoleBasedRoute = ({ element, allowedRoles }: any) => {
//   // const { userInfo } =  useGlobalContext();
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     if (userInfo) {
//       setIsAuthorized(allowedRoles.includes(userInfo.role));
//     }
//   }, [userInfo, allowedRoles]);
//   console.log("protect",isAuthorized, userInfo)
//   return isAuthorized ? (
//     element
//   ) : (
//     <Image src={"img/err/unauthorized.JPG"} h="100vh" />
//   );
// };

// export default RoleBasedRoute;
