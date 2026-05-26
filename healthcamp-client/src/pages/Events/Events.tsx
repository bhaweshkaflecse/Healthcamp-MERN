import {
  Box,
  Paper,
  Tabs,
  Title,
  Flex,
  Text,
  Button,
  Center,
  Space,
} from "@mantine/core";
import { IoLocationSharp } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { axiosPrivateInstance } from "../../api";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { eventBookingDetailsAPI } from "../../api/event";
import { useState } from "react";

const Events = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  const eventDetails = async () => {
    const resp = await axiosPrivateInstance.get(
      `${eventBookingDetailsAPI}?status=${status}`
    );
    return resp.data;
  };

  const { data: eventDetailsData, isLoading } = useQuery({
    queryKey: [`event-details/${status}`],
    queryFn: eventDetails,
  });
  

  console.log(eventDetailsData)

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader />
      </Center>
    );
  }



  return (
    <Box>
      <Title size={22} fw="bold" c="blue" mb="sm">
        Events
      </Title>

      <Paper radius="md" p={16} withBorder bg="#F8F9FA">
        <Tabs
          color="blue"
          variant="pills"
          radius="lg"
          defaultValue={status}
          onChange={(newStatus:any) => setStatus(newStatus)}
        >
          <Tabs.List bg="white" p={10}>
            <Tabs.Tab value="pending">Upcoming Events</Tabs.Tab>
            <Tabs.Tab value="completed">Event History</Tabs.Tab>
          </Tabs.List>


          <Tabs.Panel value="pending">
            {eventDetailsData?.map((data: any) => (
              <Paper key={data?.id} m={20} withBorder radius="md" p={20}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Title size="h4">{data?.serviceCalendar?.service?.name}</Title>
                  <Text size="sm" color="dimmed" maw={400}>
                      {data?.serviceCalendar?.service?.description}
                    </Text>
                    <Flex align="center" mt={10}>
                      <IoLocationSharp color="#1C7ED6" />
                      <Text ml={5}>{data?.venue}</Text>
                    </Flex>
                  </Box>

                  <Flex direction="column" gap="md">
                    {data?.bookingDates?.map((booDates: any) => (
                      <Button
                        key={booDates?.id}
                        disabled={!booDates?.event}
                        onClick={() =>
                          navigate("/booking-status", {
                            state: {
                              id: booDates?.event?.id,
                              info: data,
                              date: booDates?.date,
                            },
                          })
                        }
                        variant="outline"
                        color={booDates?.event ? "blue" : "gray"}
                      >
                        <Flex align="center" gap="sm">
                          <Text>{booDates?.date}</Text>
                          <FaArrowRight />
                        </Flex>
                      </Button>
                    ))}
                  </Flex>
                </Flex>
              </Paper>
            ))}
            {eventDetailsData?.length === 0 && (
              <Center>
                <Text my={40} c="red">
                  No upcoming events at the moment. Please check back later.
                </Text>
              </Center>
            )}
          </Tabs.Panel>

    
          <Tabs.Panel value="completed">
            {eventDetailsData?.length > 0 ? (
              eventDetailsData?.map((bookedPackage: any) => (
                <Paper key={bookedPackage?.id} m={20} withBorder radius="md" p={20}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Title size="h4">{bookedPackage?.serviceCalendar?.service?.name}</Title>
                      <Text size="sm" c="dimmed" maw={400}>
                        {bookedPackage?.serviceCalendar?.service?.description}
                      </Text>
                      <Space h="md" />
                      <Flex align="center">
                        <IoLocationSharp color="#1C7ED6" />
                        <Text ml={5}>{bookedPackage?.venue}</Text>
                      </Flex>
                    </Box>

                    <Button
                      onClick={() =>
                        navigate("/booking-status", {
                          state: {
                            info: bookedPackage,
                            id: bookedPackage?.bookingDates?.[0]?.event?.id,
                          },
                        })
                      }
                      disabled={bookedPackage?.status === "hold" || bookedPackage?.status === "cancel"}
                    >
                      View Booking Status
                    </Button>
                  </Flex>
                </Paper>
              ))
            ) : (
              <Center my={40}>
                <Text c="red" >
                  No completed events at the moment. Please create an event first.
                </Text>
              </Center>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Dashboard Button */}
      <Center mt={40}>
        <Button
          onClick={() => navigate("/dashboard")}
          mt="lg"
          p="sm"
          bg="green"
          color="#fff"
          size="h4"
          radius="xl"
        >
          Go to Dashboard
        </Button>
      </Center>
    </Box>
  );
};

export default Events;
