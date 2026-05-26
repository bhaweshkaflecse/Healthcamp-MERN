import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptParticipantReport,
  bookingReoprtPublish,
} from "../../../api/booking";
import { axiosPrivateInstance } from "../../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CompletedEvents = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["EventStatus"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(bookingReoprtPublish);
      return response.data;
    },
  });
  console.log(data);

  // const bookingId = data?.events?.map((event: any) => event.id);
  // console.log("bookingId", bookingId);

  const handleAcceptParticipantData = async (id: any) => {
    await axiosPrivateInstance.patch(`${acceptParticipantReport}/${id}`);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: handleAcceptParticipantData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["EventStatus"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Participant Report Published Successfully!");
      // navigate("/participant-data-history");
    },
    onError: (error) => {
      toast.error(`Error publishing participant report: ${error.message}`);
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

  if (error) {
    console.log(error);
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Completed Events
      </Title>
      <Paper withBorder mt={10} p={40}>
        <Group justify="space-between" mb="md">
          <Title size="h3" c="green">
            Completed Event Lists
          </Title>
          <Button onClick={() => navigate("/participant-data-history")}>
            History
          </Button>
        </Group>

        {data?.events?.map((event: any, index: number) => (
          <Paper key={index} withBorder mt={20} p={24} radius="md" shadow="sm">
            <Group justify="space-between">
              <Stack gap={4}>
                <Image
                  src={event.client?.profile || "/admin/img/imagenotfound.png"}
                  w={50}
                  // height={50}
                  radius={50}
                />
                <Text size="xl" fw={700} c="#1A1A1A">
                  {event.client?.name}
                </Text>

                <Text fw={500} size="md">
                  {event.serviceCalendar?.service?.name}
                </Text>
              </Stack>

              <Button
                size="md"
                onClick={() => mutate(event.id)}
                loading={isPending}
                color="green"
              >
                Publish Report
              </Button>
            </Group>

            <Box>
              <Text size="sm" c="dimmed" mb={4}>
                Booking Dates:
              </Text>
              <Text fw={500} size="md">
                {event.bookingDates?.map((bd: any) => bd.date).join(", ")}
              </Text>
            </Box>
          </Paper>
        ))}
      </Paper>
    </>
  );
};

export default CompletedEvents;
