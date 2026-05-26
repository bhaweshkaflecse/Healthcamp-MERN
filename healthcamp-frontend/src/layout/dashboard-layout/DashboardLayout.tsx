import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  AppShell,
  Box,
  Burger,
  Center,
  Flex,
  Loader,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Topbar from "./Topbar";
import { getAdminInfo } from "../../api/role";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [tokenMalformedError, setTokenMalformedError] = useState();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:1000px)");

  const token =
    window.sessionStorage.getItem("rToken") ||
    window.localStorage.getItem("rToken");

useEffect(() => {
    if (!token) {
      navigate("/login"); // ✅ Clean, relative path
      return;
    }
  }, [token, navigate]);

  const accessTokenn = async () => {
    try {
      const resp = await axiosPrivateInstance.get(`${getAdminInfo}`);
      return resp.data;
    } catch (error: any) {
      console.error("Error sending request", error?.response?.data?.message);
      setTokenMalformedError(error?.response?.data?.message);
      throw error;
    }
  };

  useEffect(() => {
    if (tokenMalformedError === "Refresh token malformed") {
      window.localStorage.removeItem("rToken");
      window.sessionStorage.removeItem("rToken");
      window.localStorage.removeItem("auth-storage");
      navigate("/login");
      window.location.reload();
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["AdminData"],
    queryFn: accessTokenn,
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Flex direction={"column"} align="center" justify="center">
            <Loader color="blue" />
            <Text mt={10} fw={400} ta="center">
              Your dashboard is being ready. Please wait...
            </Text>
          </Flex>
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
          <Box style={{ display: isMobile ? "none" : "block" }}>
            <Topbar data={data} />
          </Box>
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

export default DashboardLayout;
