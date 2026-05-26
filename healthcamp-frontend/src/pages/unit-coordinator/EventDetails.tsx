import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Loader,
  Paper,
  Text,
} from "@mantine/core";
import { IoIosClipboard } from "react-icons/io";
import { IoCalendar, IoLocation } from "react-icons/io5";
import { MdBook } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { getEventInfoAPI, updateStatusAPI } from "../../api/unitcoordinator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";
import { toast } from "react-toastify";

const EventDetails = () => {
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const { id } = location.state;
  const queryClient = useQueryClient();

  const [eventStatus, setEventStatus] = useState<String>("pending");

  const getEventInfo = async () => {
    const resp = await axiosPrivateInstance.get(`${getEventInfoAPI}/${id}`, {});

    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getInfo"],
    queryFn: getEventInfo,
  });

  const dateId = data?.id;

  const updateStatus = async () => {
    const resp = await axiosPrivateInstance.patch(
      `${updateStatusAPI}/${dateId}?status=${eventStatus}`
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["upcomingEvents"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["completedEvents"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["getInfo"],
        refetchType: "active",
        exact: true,
      });

      close();
      close1();

      if (eventStatus === "started") {
        toast.success("Event has been started successfully!");
      } else if (eventStatus === "completed") {
        toast.success("Event has been completed successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
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

  return (
    <Box>
      <Text my={20} size="xl" c="#6092FE">
        Events
      </Text>

      <Paper p={40} withBorder>
        <Text fw="bold">Digital Pravidhi Pvt. Ltd</Text>
        <Text c="dimmed">
          Digital Pravidhi has booked an event date for Dental Health
          Maintenance & Screening Service
        </Text>

        <Paper my={20} w={600} p={30} withBorder>
          <Text fw="bold">Event Status</Text>
          <Text c="dimmed">
            Notify Business Head and Team Lead about the status of the event.{" "}
          </Text>

          <Modal size="xl" opened={opened} onClose={close}>
            <Text size="xl" ta="center">
              Do You Want to Start The Event?
            </Text>

            <Group justify="center" mt={30}>
              <Button onClick={close} variant="outline">
                No
              </Button>
              <Button
                loading={isPending}
                onClick={() => {
                  setEventStatus("started"), mutate();
                }}
                bg="btncolor.1"
              >
                Yes
              </Button>
            </Group>
          </Modal>

          <Modal size="xl" opened={opened1} onClose={close1}>
            <Text size="xl" ta="center">
              Do You Want to Complete The Event?
            </Text>

            <Group justify="center" mt={30}>
              <Button onClick={close1} variant="outline">
                No
              </Button>
              <Button
                loading={isPending}
                onClick={() => {
                  setEventStatus("completed"), mutate();
                }}
                bg="btncolor.1"
              >
                Yes
              </Button>
            </Group>
          </Modal>

          <Box>
            <Flex my={20} gap="md" align="center">
              <Paper bg="blue" w={20} h={20} radius="xl"></Paper>
              <Text>Event Started</Text>
              <Checkbox
                disabled={data?.status == "completed"}
                checked={
                  data?.status == "completed" || data?.status == "started"
                }
                onClick={open}
              />
            </Flex>

            <Flex gap="md" align="center">
              <Paper bg="blue" w={20} h={20} radius="xl"></Paper>
              <Text>Event Completed</Text>
              <Checkbox
                disabled={
                  data?.status !== "started" || data?.status === "completed"
                } // Disable if event is not started or already completed
                checked={data?.status == "completed"}
                onClick={open1}
              />
            </Flex>
          </Box>
        </Paper>

        <Text c="blue">Event Details</Text>

        <Paper withBorder p={30} my={20}>
          <Text my={20} fw="bold" ta="center">
            {data?.bookingDate?.booking?.eventCalender?.service?.name}
          </Text>

          <Text c="dimmed">
            {data?.bookingDate?.booking?.eventCalender?.service?.description}
          </Text>

          <Box my={20}>
            <Flex gap="md" justify="space-between">
              <Flex p={10} gap="md" w={500} align="center" bg="#E5ECFA">
                <IoCalendar size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Date</Text>
                  <Text c="dimmed">{data?.bookingDate?.date}</Text>
                </Box>
              </Flex>

              <Flex p={10} gap="md" w={500} align="center" bg="#E5ECFA">
                <IoIosClipboard size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Service</Text>
                  <Text c="dimmed">
                    {data?.bookingDate?.booking?.eventCalender?.service?.name}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <IoLocation size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">Location</Text>
                <Text c="dimmed">{data?.bookingDate?.booking?.venue}</Text>
              </Box>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <RiCalendarScheduleFill size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">Event Scheduler</Text>
                <Text c="dimmed">
                  {data?.bookingDate?.booking?.client?.name}
                </Text>
              </Box>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              p={10}
              my={20}
              bg="#E5ECFA"
            >
              <Flex gap="md" align="center">
                <IoIosClipboard size={30} color="#6092FE" />
                <Box>
                  <Text fw="bold">Service</Text>
                  <Text c="dimmed">
                    {data?.bookingDate?.booking?.eventCalender?.service?.name}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Flex my={20} p={10} gap="md" align="center" bg="#E5ECFA">
              <MdBook size={30} color="#6092FE" />
              <Box>
                <Text fw="bold">No. Of Slots Booked</Text>
                <Text c="dimmed">
                  {data?.bookingDate?.booking?.eventCalender?.slot}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Paper>
      </Paper>
    </Box>
  );
};

export default EventDetails;
