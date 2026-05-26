import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../../api/booking";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const EventBooking = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["bookingData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getBooking}`);
      return response.data;
    },
  });
  console.log(data);

  const Time = (time: any) => {
    const createdTime = new Date(time);
    const nowTime: Date = new Date();
    const diffInMins: number = nowTime.getTime() - createdTime.getTime();
    const diffInMin: number = Math.floor(diffInMins / (1000 * 60));
    const diffInHr: number = Math.floor(diffInMins / (1000 * 60 * 60));
    const diffInDays: number = Math.floor(diffInMins / (1000 * 60 * 60 * 24));
    let time1: string = "";

    if (diffInMin < 60) {
      time1 = `${diffInMin} mins ago`;
    } else if (diffInHr < 24) {
      time1 = `${diffInHr} mins ago`;
    } else {
      time1 = `${diffInDays} days ago`;
    }

    return time1;
  };
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
  const filteredData = Array.isArray(data?.events)
    ? data?.events?.filter((item: any) => item.status !== "booked")
    : [];

  return (
    <>
      <Title size="h3" c="primary.0">
        Event Booking
      </Title>
      <Paper withBorder mt={10} p={20}>
        <Text c="primary.1" fw={600}>
          Event Booked Clients
        </Text>

        {filteredData.length > 0 ? (
          filteredData.map((item: any, index: any) => (
            <Paper key={index} withBorder mt={10} p={10}>
              <Group justify="space-between">
                <Group>
                  <Image
                    src={item?.client?.profile||"img/teamlead.jpg"}
                    width={50}
                    height={50}
                    radius={50}
                  />
                  <Box>
                    <Text>{item.client.name}</Text>
                    <Text size="sm" c="dimmed">
                      {item.client.email}
                    </Text>
                  </Box>
                </Group>
                <Box>
                  <Text c="dimmed">Booked: {Time(item.createdAt)}</Text>
                  <Text c="dimmed">
                    Status:{" "}
                    <span style={{ color: "green" }}>{item.status}</span>
                  </Text>
                </Box>
                <Button
                  variant="default"
                  onClick={() =>
                    navigate("/bookingRequest", {
                      state: { bookingId: item.id },
                    })
                  }
                >
                  View Details
                </Button>
              </Group>
            </Paper>
          ))
        ) : (
          <Text c="dimmed" mt={10}>
            No new bookings available.
          </Text>
        )}
      </Paper>
    </>
  );
};

export default EventBooking;
