import {
  Box,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardData } from "../../api/team";
import { axiosPrivateInstance } from "../../api";

const TeamDashboard = () => {
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["teamDashboardData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(dashboardData);
      return response.data;
    },
  });
  console.log(data);
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
    console.log(error);
  }

  return (
    <>
      <Title c="primary.0" size="h3">
        Dashboard
      </Title>
      <Group>
        <Paper radius="md" miw={300} withBorder p={20} mt={30}>
          <Group justify="space-between" align="top">
            <Box>
              <Text fw={500}>My Clients </Text>
              <Text mt={10} fw={600} c="primary.0">
                {data?.client}
              </Text>
            </Box>
            <BsFillArrowRightSquareFill
              onClick={() => navigate("/myclients")}
              color="#6092FE"
              size={25}
            />
          </Group>
        </Paper>
        <Paper radius="md" miw={300} withBorder p={20} mt={30}>
          <Group justify="space-between" align="top">
            <Box>
              <Text fw={500}>Completed Events </Text>
              <Text mt={10} fw={600} c="primary.0">
                {data?.completedEvent}
              </Text>
            </Box>
            <BsFillArrowRightSquareFill
              onClick={() => navigate("/completed-events")}
              color="#6092FE"
              size={25}
            />
          </Group>
        </Paper>
        <Paper radius="md" miw={300} withBorder p={20} mt={30}>
          <Group justify="space-between" align="top">
            <Flex direction="column" gap={5}>
              <Text fw={500}>Report Analysis </Text>
              <TbReportSearch color="#6092FE" size={25} />
            </Flex>
            <BsFillArrowRightSquareFill color="#6092FE" size={25} />
          </Group>
        </Paper>
      </Group>
      <Group>
        <Paper radius="md" miw={300} withBorder p={20} mt={30}>
          <Group justify="space-between" align="top">
            <Box>
              <Text fw={500}>Upcoming Events </Text>
              <Text mt={10} fw={600} c="primary.0">
                {data?.upcomingEvent}
              </Text>
            </Box>
            <BsFillArrowRightSquareFill
              color="#6092FE"
              size={25}
              onClick={() => navigate("/upcoming-events")}
            />
          </Group>
        </Paper>
        <Paper radius="md" miw={300} withBorder p={20} mt={30}>
          <Group justify="space-between" align="top">
            <Box>
              <Text fw={500}>Event Booking Request </Text>
              <Text mt={10} fw={600} c="primary.0">
                {data?.bookingRequest}
              </Text>
            </Box>
            <BsFillArrowRightSquareFill
              color="#6092FE"
              size={25}
              onClick={() => navigate("/book-event")}
            />
          </Group>
        </Paper>
      </Group>
      
      <Paper mt={30} withBorder p={20}>
        <Text fw={600} c="primary.0">
          KYC Approval Status
        </Text>
        <Flex gap={40} mt={30}>
          <Paper onClick={() => navigate("/team-kyc")} withBorder p={10}>
            <Group>
              <Image src="icon/calandericon.png" />
              <Text>Approved Clients</Text>
            </Group>
            <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
              <IoIosPeople size={20} color="green" />
              <Text c="green">{data?.clientApproved}</Text>
            </Group>
          </Paper>
          <Paper onClick={() => navigate("/team-kyc")} withBorder p={10}>
            <Group>
              <Image src="icon/pending.png" />
              <Text>Pending Clients</Text>
            </Group>
            <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
              <IoIosPeople size={20} color="#e2be00" />
              <Text c="#e2be00">{data?.clientPending}</Text>
            </Group>
          </Paper>
          <Paper onClick={() => navigate("/team-kyc")} withBorder p={10}>
            <Group>
              <Image src="icon/verify.png" />
              <Text>Denied Clients</Text>
            </Group>
            <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
              <IoIosPeople size={20} color="red" />
              <Text c="red">{data?.clientDenied}</Text>
            </Group>
          </Paper>
        </Flex>
      </Paper>
    </>
  );
};

export default TeamDashboard;
