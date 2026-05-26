import {
  Alert,
  Badge,
  Box,
  Center,
  Flex,
  Loader,
  Paper,
  Tabs,
  Text,
} from "@mantine/core";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { upcomingEventsAPI } from "../../api/unitcoordinator";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { axiosPrivateInstance } from "../../api";

const Events = () => {
  // interface Service {
  //   id: string;
  //   name: string;
  //   description: string;
  // }

  // interface ServiceCalendar {
  //   id: string;
  //   service: Service;
  // }
  // interface Client {
  //   id: string;
  //   name: string;
  // }

  // interface Booking {
  //   id: string;
  //   address: string;
  //   venue: string;
  //   serviceCalendar: ServiceCalendar;
  //   client: Client;
  // }

  // interface BookingDate {
  //   id: string;
  //   date?: string;
  //   booking: Booking;
  // }

  // interface UpcomingEvent {
  //   id: string;
  //   bookingDate: BookingDate;
  // }

  const fetchUpcomingEvents = async () => {
    const resp = await axiosPrivateInstance.get(
      `${upcomingEventsAPI}?status=pending`
    );
    return resp.data;
  };

  const fetchCompletedEvents = async () => {
    const resp = await axiosPrivateInstance.get(
      `${upcomingEventsAPI}?status=completed`
    );
    return resp.data;
  };

  const {
    data: upcomingEventsData,
    isLoading: upComingLoading,
    error: upComingError,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: fetchUpcomingEvents,
  });
  console.log(upcomingEventsData);

  const {
    data: completedEventsData,
    isLoading: CompletedLoading,
    error: completedError,
  } = useQuery({
    queryKey: ["completedEvents"],
    queryFn: fetchCompletedEvents,
  });

  if (upComingError && isAxiosError(upComingError)) {
    return (
      <Alert variant="light" color="red" title="Error Alert">
        {upComingError.response?.data?.message || "An error occurred"}
      </Alert>
    );
  }
  if (upComingLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  if (completedError && isAxiosError(completedError)) {
    return (
      <Alert variant="light" color="red" title="Error Alert">
        {completedError.response?.data?.message || "An error occurred"}
      </Alert>
    );
  }

  if (CompletedLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  console.log(upcomingEventsData, completedEventsData);

  function Demo() {
    const navigate = useNavigate();
    return (
      <Tabs
        px={30}
        py={10}
        my={20}
        variant="pills"
        radius="lg"
        defaultValue="gallery"
      >
        <Tabs.List
          p={10}
          style={{ borderRadius: "30px" }}
          bg="#E2E8F0"
          w={322}
          my={20}
        >
          <Tabs.Tab value="gallery">Upcoming Events</Tabs.Tab>
          <Tabs.Tab value="messages">Completed Events</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          {//@ts-ignore
          upcomingEventsData?.events?.map((event:any) => (
            <Paper
              key={event.id}
              style={{ position: "relative" }}
              py={40}
              px={100}
              withBorder
            >
              <Badge
                radius="sm"
                p={14}
                style={{ position: "absolute", left: -40, top: 50 }}
              >
                <Text style={{ textWrap: "wrap" }}>
                  {event.bookingDate?.date || "Date not available"}
                </Text>
              </Badge>
              <Flex justify="space-between">
                <Box w={600}>
                  <Text fw="bold" size="xl">
                    {event.bookingDate.booking.serviceCalendar.service.name}
                  </Text>
                  <Text c="dimmed">
                    Booked By: {""}
                    <span style={{ color: "#2457C5" }}>
                      {event.bookingDate.booking.client?.name}
                    </span>
                  </Text>

                  <Text c="dimmed">
                    {
                      event.bookingDate.booking.serviceCalendar.service
                        .description
                    }
                  </Text>
                  <Flex align="center" gap="sm">
                    <IoLocation />
                    <Text>{event.bookingDate.booking.venue}</Text>
                  </Flex>
                </Box>

                <Flex
                  justify="center"
                  align="center"
                  w={40}
                  h={40}
                  bg="#6092FE"
                >
                  <FaArrowRightLong
                    onClick={() =>
                      navigate("/event-details", { state: { id: event?.id } })
                    }
                    color="white"
                  />
                </Flex>
              </Flex>
            </Paper>
          ))}
        </Tabs.Panel>

        <Tabs.Panel value="messages">
         
          {
             //@ts-ignore
          completedEventsData?.events?.map((event:any) => (
            <Paper
              key={event.id}
              style={{ position: "relative" }}
              py={40}
              px={100}
              withBorder
            >
              <Flex
                align="center"
                justify="center"
                p={10}
                bg="#6092FE"
                c="white"
                style={{ position: "absolute", left: -20, top: 50 }}
              >
                {event.bookingDate?.date || ""}
              </Flex>
              <Flex justify="space-between">
                <Box w={600}>
                  <Text fw="bold" size="xl">
                    {event.bookingDate.booking.serviceCalendar.service.name}
                  </Text>
                  <Text c="dimmed">
                    Booked By: {""}
                    <span style={{ color: "#2457C5" }}>
                      {event.bookingDate.booking.client?.name}
                    </span>
                  </Text>
                  <Text c="dimmed">
                    {
                      event.bookingDate.booking.serviceCalendar.service
                        .description
                    }
                  </Text>
                  <Flex align="center" gap="sm">
                    <IoLocation />
                    <Text>{event.bookingDate.booking.venue}</Text>
                  </Flex>
                </Box>

                <Flex
                  justify="center"
                  align="center"
                  w={40}
                  h={40}
                  bg="#6092FE"
                >
                  <FaArrowRightLong color="white" />
                </Flex>
              </Flex>
            </Paper>
          ))}
        </Tabs.Panel>
      </Tabs>
    );  
  }

  return (
    <Box>
      <Flex p={20} justify="center" bg="blue">
        <Text size="xl" c="white" ta="center">
          Your Assigned Events
        </Text>
      </Flex>

      <Demo />
    </Box>
  );
};

export default Events;
