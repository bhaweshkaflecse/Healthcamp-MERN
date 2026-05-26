// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/sidebar/Sidebar";
// import { AppShell, Box, Burger, Center, Loader, Space } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import TopNavBar from "../components/Navbar/TopNavBar";
// import { useContext, useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useGlobalContext from "../providers/context";
// import { infoClientAPI } from "../api/users";
// import api from "../api";
// import { KycContext } from "../providers/context/KycContext";
// import { toast } from "react-toastify";

// const ClientLayout = () => {
//   const [opened, { toggle }] = useDisclosure();
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const { generateAcessToken } = useGlobalContext();
//   const context = useContext(KycContext);
//   const navigate = useNavigate()

//   useEffect(() => {
//     const refreshTokn = localStorage.getItem("rToken") || sessionStorage.getItem("rToken");
//     setRefreshToken(refreshTokn);
//   }, []);


//   useEffect(() => {
//     const checkUserLoggedIn = () => {
//       if (refreshToken == null) return;
//       if (!refreshToken) {
//         navigate("/login");
//         return
//       }
//     };
//     checkUserLoggedIn();
//   }, []);

//   const getClientInfo = async () => {
//     try {
//       const token = await generateAcessToken();
//       const resp = await api.get(infoClientAPI, {
//         headers: {
//           // Authorization: token,
//         },
//       });


//       context?.updateKycStatus(resp.data.kyc.kycStatus);

//       return resp.data;
//     } catch (error: any) {
//       console.log(error);
//       if (error.response && error.response.status === 401 || error.response.status === 403) {
//         window.localStorage.removeItem('rToken')
//         window.sessionStorage.removeItem('rToken')
//         window.location.href = "/login";
//       }
//     }
//   };

//   const { isLoading, error } = useQuery({
//     queryKey: ["userInfo"],
//     queryFn: getClientInfo,
//     enabled: !!refreshToken,
//   });

//   console.log(error);
//   if (isLoading) {
//     return (
//       <Center mt={100}>
//         <Box ta="center">
//           <Loader color="blue" />
//           <Space h={'xl'} />
//           <div>We are preparing your data</div>
//           <div>Please wait...</div>
//         </Box>
//       </Center>
//     )
//   }

//   return (
//     <>
//       <AppShell
//         header={{ height: 60 }}
//         navbar={{
//           width: { sm: 250, lg: 250 },
//           breakpoint: "sm",
//           collapsed: { mobile: !opened },
//         }}
//         padding="md"
//       >
//         <AppShell.Header>
//           <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
//           <TopNavBar />
//         </AppShell.Header>

//         <AppShell.Navbar>
//           <Sidebar />
//         </AppShell.Navbar>

//         <AppShell.Main
//           bg={"#F8F9FA"}
//           pt={{ lg: 95, sm: 80 }}
//           pr={{ lg: 30, sm: 18 }}
//           pb={{ lg: 30, sm: 15 }}
//           pl={{ lg: 280, sm: 280 }}
//         >
//           <Outlet />
//         </AppShell.Main>
//       </AppShell>
//     </>
//   );
// };

// export default ClientLayout;


import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { AppShell, Box, Burger, Center, Loader, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TopNavBar from "../components/Navbar/TopNavBar";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useGlobalContext from "../providers/context";
import { infoClientAPI } from "../api/users";
import api from "../api";
import { KycContext } from "../providers/context/KycContext";

const ClientLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const { generateAcessToken } = useGlobalContext();
  const context = useContext(KycContext);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshTokn = localStorage.getItem("rToken") || sessionStorage.getItem("rToken");
    setRefreshToken(refreshTokn);
    setIsTokenChecked(true);
  }, []);

  useEffect(() => {
    if (isTokenChecked) {
      if (!refreshToken) {
        navigate("/login");
      }
    }
  }, [refreshToken, isTokenChecked, navigate]);

  const getClientInfo = async () => {
    try {
      const token = await generateAcessToken();
      const resp = await api.get(infoClientAPI, {
        headers: {
          Authorization: token,
        },
      });

      context?.updateKycStatus(resp.data.kyc.kycStatus);
      return resp.data;
    } catch (error: any) {
      console.log(error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.localStorage.removeItem('rToken');
        window.sessionStorage.removeItem('rToken');
        window.location.href = "/login";
      }
      throw error;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getClientInfo,
    enabled: !!refreshToken && isTokenChecked, // Only enable if we have a token AND we've checked for it
  });

  // If we haven't completed the token check yet, show nothing
  if (!isTokenChecked) {
    return null;
  }

  // If we checked and there's no token, useEffect will redirect, so no need to handle here

  // Show loading state if we have a token and the query is loading
  if (isLoading) {
    return (
      <Center mt={100}>
        <Box ta="center">
          <Loader color="blue" />
          <Space h={'xl'} />
          <div>We are preparing your data</div>
          <div>Please wait...</div>
        </Box>
      </Center>
    );
  }

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: { sm: 250, lg: 250 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <TopNavBar />
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main
          bg={"#F8F9FA"}
          pt={{ lg: 95, sm: 80 }}
          pr={{ lg: 30, sm: 18 }}
          pb={{ lg: 30, sm: 15 }}
          pl={{ lg: 280, sm: 280 }}
        >
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default ClientLayout;