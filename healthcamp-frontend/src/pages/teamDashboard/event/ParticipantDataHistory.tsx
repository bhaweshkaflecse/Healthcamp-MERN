import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../../api";
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ForwardedParticipantReport } from "../../../api/booking";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface ParticipantData {
  client: string;
  date: string;
  eventId: string;
  id: string;
  participant: number;
  service: string;
}

const ParticipantDataHistory = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedData, setSelectedData] = useState<ParticipantData | null>(null);

  const { data, isLoading } = useQuery<ParticipantData[]>({
    queryKey: ["ForwardedParticipantHistory"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${ForwardedParticipantReport}?publish==false`
      );
      const rawEvents = response.data?.events || [];

      const formattedData: ParticipantData[] = rawEvents.flatMap((event: any) =>
        event.bookingDates.map((booking: any) => ({
          client: event.client?.name || "Unknown Client",
          date: booking.date,
          eventId: booking.event?.id,
          id: booking.id,
          participant: booking.event?.participant || 0,
          service: event.serviceCalendar?.service?.name || "Unknown Service",
        }))
      );

      return formattedData;
    },
  });

  console.log(data);

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  const handleParticipantClick = (participant: ParticipantData) => {
    setSelectedData(participant);
    open(); // Open the modal
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Title c="primary.0" size="h2" style={{ background: "white" }}>
            Report Details
          </Title>
        }
      >
        {selectedData && (
          <Box p={20}>
            <Text size="lg" fw={600}>
              Client: {selectedData.client}
            </Text>
            <Text size="sm" c="dimmed">
              Event ID: {selectedData.eventId}
            </Text>
            <Divider my={10} />
            <Group>
              <Text fw={500}>Date:</Text>
              <Text>{selectedData.date}</Text>
            </Group>
            <Group>
              <Text fw={500}>Participants:</Text>
              <Text>{selectedData.participant}</Text>
            </Group>
            <Group>
              <Text fw={500}>Service:</Text>
              <Text>{selectedData.service}</Text>
            </Group>
          </Box>
        )}
      </Modal>

      <Title size="h2" c="#6092FE" mb={16}>
        Forwarded Participant History
      </Title>

      {data?.map((participant: ParticipantData, index: number) => (
        <Paper
          key={participant.id || index}
          withBorder
          mt={20}
          p={24}
          radius="md"
          shadow="sm"
        >
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="xl" fw={700} c="#1A1A1A">
                {participant.client}
              </Text>

              <Text fw={500} size="md">
                {participant.service}
              </Text>

              <Text size="sm" c="blue">
                Booking Date:{" "}
                <Text span fw={500}>
                  {participant.date}
                </Text>
              </Text>

              <Text size="sm" c="dimmed">
                Participants:{" "}
                <Text span fw={500}>
                  {participant.participant}
                </Text>
              </Text>
            </Stack>

            <Button
              size="md"
              color="gray"
              variant="outline"
              onClick={() => handleParticipantClick(participant)} // Open the modal on click
            >
              Report Published
            </Button>
          </Group>
        </Paper>
      ))}
    </>
  );
};

export default ParticipantDataHistory;
