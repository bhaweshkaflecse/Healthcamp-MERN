import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { BsCalendar3EventFill } from "react-icons/bs";
import { FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoAdd, IoPeopleSharp } from "react-icons/io5";
import { PiNotebookFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeParticipant,
  checkSubteam,
  eventDetails,
} from "../../../api/booking";
import { axiosPrivateInstance } from "../../../api";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EventCalendar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state;
  const isChangePage = "change";
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(setError);

  const { data, isLoading } = useQuery({
    queryKey: [`getEventDetails/${eventId}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${eventDetails}/${eventId}`
      );

      return response.data;
    },
    staleTime: 0,
  });
  const [inputValue, setInputValue] = useState(data?.event?.participant || ""); // Default value as empty string
  useEffect(() => {
    if (data?.event?.participant) {
      setInputValue(data.event.participant);
    }
  }, [data]);

  const clientName = data?.booking?.client?.name;
  const availableEnrollParticipant = data?.availableEnrollParticipant;

  const { data: bookingData } = useQuery({
    queryKey: [`BookingDAta${data?.id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${checkSubteam}/${data?.id}`
      );
      return response.data;
    },
  });

  const handleParticipantChange = async () => {
    try {
      const participantNumber = parseInt(inputValue);
      const response = await axiosPrivateInstance.patch(
        `${changeParticipant}/${data?.event?.id}`,
        {
          participant: participantNumber,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while changing participant:", error);
      throw error;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleParticipantChange,
    mutationKey: ["getEventDetails"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`getEventDetails/${eventId}`],
        refetchType: "active",
      });
      toast.success("Participant Changed successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error while changing participant:", error);

      // Display error message in toast
      const errorMessage =
        // @ts-ignore
        error?.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const eventIdd = Array.isArray(bookingData?.subteam)
    ? bookingData.subteam.map((item: any) => item?.id)
    : [];

  const subteamName = Array.isArray(bookingData?.subteam)
    ? bookingData.subteam.map((subteam: any) => subteam?.subTeam?.name)
    : [];

  const service = data?.booking?.serviceCalendar?.service;

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
        Event Calendar
      </Title>
      <Paper withBorder mt={10} p={20}>
        <Group justify="center">
          <Image
            src={data?.booking?.client?.profile || "img/teamlead.jpg"}
            width={30}
            height={30}
            radius={50}
          />
          <Text fw={600}>
            {data?.booking?.client?.name} is participating the events
          </Text>
        </Group>
        <Text size="sm" c="dimmed" ta="center" mt={5}>
          Please assign your prepared subteam to the event organizing venue to
          commence the organization process for the client's event.
        </Text>
        <Center>
          {!bookingData?.subteam ? (
            <Button
              mt={20}
              leftSection={<IoAdd size={20} color="white" />}
              bg="btncolor.1"
              onClick={() =>
                navigate("/assign-subteam", {
                  state: {
                    service,
                    dataId: data.id,
                    clientName,
                    isChangePage,
                    availableEnrollParticipant,
                  },
                })
              }
            >
              Assign Subteam
            </Button>
          ) : (
            <Group mt={50}>
              <Text fw={600} c="dimmed">
                Assigned Subteam: {""}
                <span style={{ color: "#2457C5" }}>{subteamName}</span>
              </Text>
              <Button
                variant="default"
                leftSection={<CiEdit size={20} />}
                onClick={() =>
                  navigate("/assign-subteam", {
                    state: {
                      service,
                      eventIdd,
                      subteamName,
                      clientName,
                      availableEnrollParticipant,
                    },
                  })
                }
              >
                Change Subteam
              </Button>
            </Group>
          )}
        </Center>
        <Text fw={600} c="primary.0" mt={50}>
          Booking Details
        </Text>
        <Paper withBorder mt={10} p={20}>
          <Text ta="center" fw={600}>
            {data?.booking?.serviceCalendar?.service?.name}
          </Text>
          <Text ta="center" mt={10}>
            {data?.booking?.serviceCalendar?.service?.description}
          </Text>

          <Flex gap={20} justify="space-between">
            <Paper bg="#e5ecfa" w="50%" withBorder mt={10} p={20}>
              <Group>
                <FaCalendarAlt size={30} color="#6092fe" />
                <Box>
                  <Text fw={400}>Date</Text>
                  <Text size="sm" c="dimmed">
                    {data?.date}
                  </Text>
                </Box>
              </Group>
            </Paper>
            <Paper bg={"#e5ecfa"} w="50%" withBorder mt={10} p={20}>
              <Group>
                <FaShoppingBag size={30} color="#6092fe" />
                <Box>
                  <Text fw={400}>Service</Text>
                  <Text size="sm" c="dimmed">
                    {data?.booking?.serviceCalendar?.service?.name}
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
                  {data?.booking?.venue}
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
                  {data?.booking?.client?.name}
                </Text>
              </Box>
            </Group>
          </Paper>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <IoPeopleSharp size={28} color="#6092fe" />
              <Box>
                <Group>
                  <Text fw={400}>Participants</Text>
                  {isEditing ? (
                    <Button
                      loading={isPending}
                      variant="default"
                      onClick={() => {
                        if (!error) mutate(); // Only mutate if there's no error
                      }}
                    >
                      <FaCheck
                        style={{ cursor: "pointer" }}
                        size={25}
                        color="blue"
                      />
                    </Button>
                  ) : (
                    <CiEdit
                      style={{ cursor: "pointer" }}
                      size={25}
                      color="blue"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </Group>
                {isEditing ? (
                  <Group>
                    <Badge p={10} color="green" variant="filled" size="lg">
                      Number of participants left: {availableEnrollParticipant}
                    </Badge>
                    <Box>
                      <TextInput
                        size="sm"
                        value={inputValue}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setInputValue(value);

                          //   if (value > availableEnrollParticipant) {
                          //     setError(
                          //       `Cannot assign more than ${availableEnrollParticipant} participants.`
                          //     );
                          //   } else {
                          //     setError(null); // Clear error
                          //   }
                        }}
                      />
                      {error && (
                        <Text size="xs" c="red" mt={4}>
                          {error}
                        </Text>
                      )}
                    </Box>
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">
                    {inputValue}
                  </Text>
                )}
              </Box>
            </Group>
          </Paper>
          <Paper bg={"#e5ecfa"} withBorder mt={10} p={20}>
            <Group>
              <PiNotebookFill size={28} color="#6092fe" />
              <Box>
                <Text fw={400}>No. of Slots Booked</Text>
                <Text size="sm" c="dimmed">
                  {data?.booking?.eventCalender?.slot}
                </Text>
              </Box>
            </Group>
          </Paper>
        </Paper>
      </Paper>
    </>
  );
};

export default EventCalendar;
