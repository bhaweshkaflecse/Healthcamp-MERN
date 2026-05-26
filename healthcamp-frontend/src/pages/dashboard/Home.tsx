import {
  Box,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { dashboardInfo } from "../../api/dashboard";
import ErrorAxios from "../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../api";
import useAuthStore from "../../providers/context/useAuthStore";
import Events from "../unit-coordinator/Events";
import TeamDashboard from "../teamDashboard/TeamDashboard";
import FinanceDashboard from "../finance/FinanceDashboard";
import DataEntryDashboard from "../dataEntry/Home";
import CallCenterDashboard from "../callCenter/Home";
import { chartData } from "../../api/finance";
import { useState } from "react";
import IssuesList from "../itSupport/IssuesList";
import ClientsList from "../sales/ClientLists";
const Home = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { role } = useAuthStore();
  const [filter, setFilter] = useState("week"); // Default filter

  const { isLoading, data, error } = useQuery({
    queryKey: ["packageList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(dashboardInfo);
      return response.data;
    },
  });
  const { data: PurchaseStat } = useQuery({
    queryKey: ["PurchaseStat", filter], // Include filter in queryKey
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${chartData}?purchaseState=${filter}`
      );
      return response.data;
    },
  });
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (error) {
    return (
      <ErrorAxios error={error} fallbackMessage="Failed to load services" />
    );
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  const BusinessHead = () => {
    return (
      <>
        <Title size="h2" c="primary.0">
          Dashboard
        </Title>
        <Flex
          gap={20}
          direction={isMobile ? "column" : "row"}
          justify="space-between"
        >
          <Paper
            onClick={() => navigate("/package")}
            miw={230}
            withBorder
            p={20}
            mt={10}
          >
            <Group>
              <Image src="icon/Calender ICON (1).png" />
              <Text>Total Packages</Text>
            </Group>
            <Group mt={20} justify="space-between" bg="whitesmoke" p={10}>
              <Image src="icon/blueline.png" />
              <Text>{data?.packageLength}</Text>
            </Group>
          </Paper>
          <Paper
            onClick={() => navigate("/client")}
            miw={230}
            withBorder
            p={20}
            mt={10}
          >
            <Group>
              <Image src="icon/add.png" />
              <Text>Client Registered</Text>
            </Group>
            <Group mt={20} justify="space-between" bg="whitesmoke" p={10}>
              <Image src="icon/orangeline.png" />
              <Text>{data?.client}</Text>
            </Group>
          </Paper>
          <Paper
            miw={230}
            withBorder
            p={20}
            mt={10}
            onClick={() => navigate("/finance")}
          >
            <Group>
              <Paper radius="md" p={10} bg="#DCFFE4">
                <Image src="icon/ticketstar.png" />
              </Paper>
              <Text>Package Sold</Text>
            </Group>
            <Group mt={20} justify="space-between" bg="whitesmoke" p={10}>
              <Image src="icon/greenline.png" />
              <Text>{data?.soldPackage}</Text>
            </Group>
          </Paper>
          <Paper miw={230} withBorder p={20} mt={10}>
            <Group>
              <Paper radius="md" p={10} bg="whitesmoke">
                <Image src="icon/history.png" />
              </Paper>
              <Text>History</Text>
            </Group>
            <Group mt={20} justify="space-between" bg="whitesmoke" p={10}>
              <Image src="icon/blackline.png" />
              <Text>{data?.event}</Text>
            </Group>
          </Paper>
        </Flex>

        <Paper withBorder mt={20} p={10}>
          <Group justify="space-between">
            <Text fw={600}>Sales Overview</Text>
            <SegmentedControl
              bg={"#F8F8F8"}
              color="green"
              size="sm"
              radius="xl"
              data={["week", "month", "year"]}
              value={filter}
              onChange={setFilter} // Update filter state on change
            />
          </Group>
          <AreaChart
            mt={20}
            p={5}
            h={300}
            data={PurchaseStat?.purchaseStat}
            dataKey="label"
            type="stacked"
            series={[{ name: "amount", color: "indigo.6" }]}
            curveType="monotone"
            tickLine="none"
            withDots={false}
          />
        </Paper>
      </>
    );
  };
  if (role === "unit_coordinator") {
    return <Events />;
  }
  if (role === "team_lead") {
    return <TeamDashboard />;
  }

  if (role === "business_head") {
    return <BusinessHead />;
  }
  if (role === "finance") {
    return <FinanceDashboard />;
  }
  if (role === "data_entry") {
    return <DataEntryDashboard />;
  }
  if (role === "call_centre") {
    return <CallCenterDashboard />;
  }
  if (role === "IT_team") {
    return <IssuesList />;
  }
  if (role === "sales") {
    return <ClientsList />;
  }

  return (
    <>
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    </>
  );
};

export default Home;
