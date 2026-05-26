import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Input,
  Loader,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendar3EventFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { PiNotebookFill } from "react-icons/pi";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptBooking, booking, declineBooking } from "../../../api/booking";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { axiosPrivateInstance } from "../../../api";
import { CiEdit } from "react-icons/ci";
import { MdSave } from "react-icons/md";

const BookingRequest = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.bookingId;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDate, setEditedDate] = useState<{ [key: string]: string }>({});

  const handleSave = (id: string) => {
    console.log("Saving date:", editedDate[id]); // Replace this with API call
    setEditingId(null); // Exit edit mode after saving
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${booking}/${id}`);
      return response.data;
    },
  });
  console.log(data);
  const handleSubmit = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        `${acceptBooking}/${data?.id}`,
        {}
      );
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookingData", id],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["upcomingEventsData"],
        refetchType: "active",
        exact: true,
      });
      navigate("/upcoming-events");
      toast.success("Booking Accepted");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const DeclingBooking = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        `${declineBooking}/${data?.id}`,
        { comment: comment },
        {}
      );
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isPending: btnloading, mutate: declineEvent } = useMutation({
    mutationFn: DeclingBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking", id],
        refetchType: "active",
        exact: true,
      });
      navigate("/book-event");
      toast.success("Declined Event Booking Successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  if (error) {
    console.log(error);
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

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Event Booking Request"
        centered
      >
        <Paper withBorder mt={10} p={20}>
          <Text>Comment a reason for rejection</Text>
          <Input
            placeholder="Comment a reason"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Group mt={20} justify="end">
            <Button bg="#ef1717">Cancel</Button>
            <Button
              bg="btncolor.1"
              loading={btnloading}
              onClick={() => declineEvent()}
            >
              Submit
            </Button>
          </Group>
        </Paper>
      </Modal>

      <Title size="h3" c="primary.0">
        Event Booking Requests
      </Title>
      <Paper withBorder mt={10} p={20}>
        <Text fw={600}>{data?.client?.name}</Text>
        <Text mt={10} size="sm" c="dimmed">
          {data?.client?.name} has requested to book a event date
        </Text>
        <Group mt={40} justify="space-between">
          <Text fw={500} size="20px" c="primary.0">
            Booking Request Details
          </Text>

          {data?.status !== "booked" && (
            <Group>
              <Button bg="#ef1717" onClick={open}>
                Decline
              </Button>
              <Button bg="green" loading={isPending} onClick={() => mutate()}>
                Accept
              </Button>
            </Group>
          )}
        </Group>

        <Paper withBorder mt={10} p={20}>
          <Text ta="center" fw={600}>
            {data?.serviceCalendar.service.name}
          </Text>
          <Text ta="center" mt={10}>
            {data?.serviceCalendar.service.description}
          </Text>

          <Flex gap={20} justify="space-between">
            <Paper bg="#e5ecfa" w="50%" withBorder mt={10} p={20}>
              <Group>
                <Group>
                  <FaCalendarAlt size={30} color="#6092fe" />

                  <Text fw={400}>Date</Text>
                </Group>
              </Group>

              {data?.bookingDates.map((item: any) => {
                const isEditing = editingId === item.id;

                return (
                  <Group
                    ml={40}
                    key={item.id}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Show input when editing */}
                    {isEditing ? (
                      <>
                        <TextInput
                          value={editedDate[item.id] || item.date}
                          onChange={(e) =>
                            setEditedDate({
                              ...editedDate,
                              [item.id]: e.target.value,
                            })
                          }
                          autoFocus
                          w={150}
                        />
                        <Button
                          size="xs"
                          leftSection={<MdSave />}
                          onClick={() => handleSave(item.id)}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Show edit icon only on hover */}
                        {hoveredId === item.id && (
                          <ActionIcon onClick={() => setEditingId(item.id)}>
                            <CiEdit size={20} color="#6092fe" />
                          </ActionIcon>
                        )}
                        <Text c="dimmed">{item?.date}</Text>
                      </>
                    )}
                  </Group>
                );
              })}
            </Paper>
            <Paper bg={"#e5ecfa"} w="50%" withBorder mt={10} p={20}>
              <Group>
                <FaShoppingBag size={30} color="#6092fe" />
                <Box>
                  <Text fw={400}>Service</Text>
                  <Text size="sm" c="dimmed">
                    {data?.serviceCalendar.service.name}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Flex>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <FaLocationDot size={30} color="#6092fe" />
              <Box>
                <Text fw={400}>Location</Text>
                <Text size="sm" c="dimmed">
                  {data?.venue}
                </Text>
              </Box>
            </Group>
          </Paper>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <BsCalendar3EventFill size={28} color="#6092fe" />
              <Box>
                <Text fw={400}>Event Scheduler</Text>
                <Text size="sm" c="dimmed">
                  {data?.client.name}
                </Text>
              </Box>
            </Group>
          </Paper>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <IoPeopleSharp size={28} color="#6092fe" />
              <Box>
                <Text fw={400}>Participants</Text>
                <Text size="sm" c="dimmed">
                  {data?.enrollPackage.participant}
                </Text>
              </Box>
            </Group>
          </Paper>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <PiNotebookFill size={28} color="#6092fe" />
              <Box>
                <Text fw={400}>No. of Slots Booked</Text>
                <Text size="sm" c="dimmed">
                  {data?.eventCalender.slot}
                </Text>
              </Box>
            </Group>
          </Paper>
        </Paper>
      </Paper>
    </>
  );
};

export default BookingRequest;
