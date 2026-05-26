import {
  Box,
  Button,
  Center,
  Flex,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { axiosPrivateInstance } from "../../api";
import { completedEventDataEntry } from "../../api/booking";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [status, setStatus] = useState<"created" | "published">("created");
  const navigate = useNavigate();

  const getEventsByStatus = async () => {
    const resp = await axiosPrivateInstance(
      `${completedEventDataEntry}?status=${status}`
    );
    return resp.data;
  };

  const { data } = useQuery({
    queryKey: [`events-by-status/${status}`],
    queryFn: getEventsByStatus,
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <Paper>
      <Tabs
        color="gray"
        variant="pills"
        radius="lg"
        value={status === "created" ? "pending" : "completed"}
        onChange={(tabValue) =>
          setStatus(tabValue === "pending" ? "created" : "published")
        }
      >
        <Tabs.List bg="white" p={10} w={340}>
          <Tabs.Tab value="pending">Pending Events</Tabs.Tab>
          <Tabs.Tab value="completed">Event History</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel p="10" value="pending">
          {data?.events?.length > 0 ? (
            data?.events?.map((events: any) => (
              <Paper
                key={events?.id}
                style={{ position: "relative" }}
                m={20}
                withBorder
                radius="md"
              >
                <Flex align="center" p={10} justify="space-between">
                  <Box>
                    <Title size="h4">{events?.client?.name}</Title>
                    <Text c="dimmed" maw="400" size="sm">
                      {events?.serviceCalendar?.service?.name}
                    </Text>
                    <Flex align="center">
                      <IoLocationSharp color="#1C7ED6" />
                      <Text>{events?.venue}</Text>
                    </Flex>
                  </Box>

                  <Flex direction="column" gap="md">
                    {events?.bookingDates?.map((item: any) => (
                      <Button
                        key={item?.id}
                        color="blue"
                        variant="default"
                        onClick={() =>
                          navigate(`/find-student/${item?.id}`, {
                            state: {
                              eventId: item?.event?.id,
                              serviceId: events?.serviceCalendar?.service?.id,
                              reportState: events?.isReportPublish,
                              reportId: item?.event?.report?.id,
                            },
                          })
                        }
                        rightSection={<FaArrowRight />}
                      >
                        <Text>{item?.date}</Text>
                      </Button>
                    ))}
                  </Flex>
                </Flex>
              </Paper>
            ))
          ) : (
            <Center>
              <Text fw="bold" c="red">
                No events available at the moment.
              </Text>
            </Center>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          {data?.events?.length > 0 ? (
            data?.events?.map((events: any) => (
              <Paper
                key={events?.id}
                style={{ position: "relative" }}
                m={20}
                withBorder
                radius="md"
              >
                <Flex align="center" p={10} justify="space-between">
                  <Box>
                    <Title size="h4">{events?.client?.name}</Title>
                    <Text c="dimmed" maw="400" size="sm">
                      {events?.serviceCalendar?.service?.name}
                    </Text>
                    <Flex align="center">
                      <IoLocationSharp color="#1C7ED6" />
                      <Text>{events?.venue}</Text>
                    </Flex>
                  </Box>

                  <Flex direction="column" gap="md">
                    {events?.bookingDates?.map((item: any) => (
                      <Button
                        key={item?.id}
                        color="blue"
                        variant="default"
                        onClick={() =>
                          navigate(`/find-student/${item?.id}`, {
                            state: {
                              eventId: item?.event?.id,
                              serviceId: events?.serviceCalendar?.service?.id,
                              reportState: events?.isReportPublish,
                              reportId: item?.event?.report?.id,
                            },
                          })
                        }
                        rightSection={<FaArrowRight />}
                      >
                        <Text>{item?.date}</Text>
                      </Button>
                    ))}
                  </Flex>
                </Flex>
              </Paper>
            ))
          ) : (
            <Center my={40}>
              <Text fw="bold" c="red">
                No events available at the moment.
              </Text>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default Home;
