import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";
import { toast } from "react-toastify";
import { Avatar, Box, Button, Flex, Paper, Text, Title } from "@mantine/core";
import { acceptParticipantReport } from "../../../api/booking";

const PublishReport = () => {
  const location = useLocation();
  console.log(location.state);
  const queryClient = useQueryClient();
  const eventId = location.state?.eventId;
  const navigate = useNavigate();

  const handleAcceptParticipantData = async () => {
    await axiosPrivateInstance.patch(`${acceptParticipantReport}/${eventId}`);
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
      navigate("/completed-events");
    },
    onError: (error) => {
      toast.error(`Error publishing participant report: ${error.message}`);
    },
  });

  return (
    <Paper p={20} withBorder>
      <Title size="h2" c="primary.0">
        Publish Report{" "}
      </Title>
      <Paper p={40} withBorder mt={10}>
        <Text c="blue" fw="bold" mb={20}>
          Participants details
        </Text>

        <Paper p={20} withBorder>
          <Flex gap="md" justify="center" align="center" my={20}>
            <Avatar src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" />
            <Text c="blue">{location.state?.client}</Text>
          </Flex>

          <Box py={10} px={20} bg="#E5ECFA">
            <Text fw="bold">No. of Participants</Text>
            <Text c="dimmed">{location.state?.participant}</Text>
          </Box>

          <Flex align="center" py={10} px={20} my={20} bg="#E5ECFA" gap={30}>
            <Box>
              <Text fw="bold">Name of service</Text>
              <Text c="dimmed">{location.state?.service}</Text>
            </Box>
          </Flex>

          <Flex my={20} gap="lg" justify="center">
            <Button color="green" onClick={() => mutate()} loading={isPending}>
              Publish
            </Button>
          </Flex>
        </Paper>
      </Paper>
    </Paper>
  );
};
export default PublishReport;
