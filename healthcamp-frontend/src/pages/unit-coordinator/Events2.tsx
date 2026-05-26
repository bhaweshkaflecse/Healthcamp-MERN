import { Avatar, Box, Flex, Paper, Text } from "@mantine/core";
import { FaArrowRightLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { clientByServiceAPI } from "../../api/unitcoordinator";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";

const Events2 = () => {
  interface Client {
    id: string;
    name: string;
    email: string;
  }

  interface Booking {
    id: string;
    client: Client;
  }

  interface Enroll {
    id: string;
    booking: Booking;
  }

  interface Package {
    id: string;
    enroll: Enroll[];
  }
  interface Clients {
    id: string;
    package: Package[];
  }
  const navigate = useNavigate();

  const location = useLocation();
  const { serviceId } = location.state;

  console.log("Service Id", serviceId);

  const clientsByService = async (): Promise<Clients[]> => {
    const resp = await axiosPrivateInstance.get(
      `${clientByServiceAPI}/${serviceId}`,
      {}
    );

    return resp.data;
  };

  const { data, isLoading, isError } = useQuery<Clients[]>({
    queryKey: ["assignedClients"],
    queryFn: clientsByService,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading clients</Text>;

  console.log("lamo", data);

  return (
    <Box>
      <Text size="xl" c="blue">
        Events
      </Text>

      <Paper p={40} withBorder>
        <Text ta="center" fw="bold">
          Dental Health Maintenance & Screening Service
        </Text>

        <Text my={20} ta="center">
          List of Clients Assigned For You In this Service
        </Text>
        {data?.map((clients) => (
          <Flex
            key={clients?.id}
            p={16}
            align="center"
            justify="space-between"
            bg="#E5ECFA"
          >
            <Flex gap="md" align="center">
              <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr8jRvIXTe9GBYg9dD5jyHUfOx0_WBijJG7g&s" />
              <Box>
                <Text fw="bold">
                  {clients?.package?.[0]?.enroll?.[0]?.booking?.client?.name ||
                    "Unknown Client"}
                </Text>
                <Text c="dimmed">
                  {clients?.package?.[0]?.enroll?.[0]?.booking?.client?.email}
                </Text>
              </Box>
            </Flex>

            <FaArrowRightLong
              onClick={() => navigate(`/event-details/${clients?.id}`)}
              size={30}
              color="#0051FF"
            />
          </Flex>
        ))}
      </Paper>
    </Box>
  );
};

export default Events2;
