import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { upcomingEvents } from "../../../api/booking";
import { axiosPrivateInstance } from "../../../api";

const UpcomingEvents = () => {
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["upcomingEventsData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(upcomingEvents);
      return response.data;
    },
  });
  console.log("upcomingEvents", data);
  function formatDate(dateString: any) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
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
  if (error) {
    console.log(error);
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Upcoming Events
      </Title>
      <Paper withBorder mt={10} p={40}>
        <Group justify="space-between">
          <Title size="h3" c="primary.1">
            Upcoming Event Lists
          </Title>
          <Button
            variant="default"
            onClick={() => navigate("/completed-events")}
          >
            Event History
          </Button>
        </Group>
        {data?.map((item: any, index: any) => {
          return (
            <Paper key={index} withBorder mt={10} p={20}>
              <Group justify="space-between" style={{ position: "relative" }}>
                <Box
                  p={5}
                  w={70}
                  style={{
                    position: "absolute",
                    top: "1px",
                    left: "-50px",
                    backgroundColor: "#6092FE",
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                >
                  <Text size="sm">{formatDate(item?.date)}</Text>
                </Box>

                <Text ml={50} fw={600}>
                  {item.booking.serviceCalendar.service.name}
                </Text>
                {item?.event && (
                  <Badge bg="green">
                    Assigned to:{""}
                    {item?.event?.subteam?.map(
                      (item: any) => item.subTeam?.name
                    )}
                  </Badge>
                )}

                <BsFillArrowRightSquareFill
                  size={30}
                  color="#6092FE"
                  onClick={() =>
                    navigate(`/event-calendar`, { state: item.id })
                  }
                />
              </Group>

              <Text ml={50} fw={600} size="sm" c="dimmed">
                Booked By: {""}
                <span style={{ color: "#2457C5" }}>
                  {item.booking.client.name}
                </span>
              </Text>
              <Text ml={50} c="dimmed" mt={5} w="50%">
                {item.booking.serviceCalendar.service.description}
              </Text>
              <Group mt={10} ml={50}>
                <FaLocationDot color="#6092FE" size={25} />
                <Text>{item.booking.venue}</Text>
              </Group>
            </Paper>
          );
        })}
      </Paper>
    </>
  );
};

export default UpcomingEvents;
