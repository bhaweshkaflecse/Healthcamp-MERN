import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignteamlead, getclient, getteamlead } from "../../../api/client";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";

const AssignTeamLead = () => {
  const queryClient = useQueryClient();
  const [selectedTeamLeadId, setSelectedTeamLeadId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: clientData, error } = useQuery({
    queryKey: [`clientInfo/${id}`, id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getclient}/${id}`);
      return response.data;
    },
  });

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: ["teamleadlist"],
    queryFn: async () => {
      const resp = await axiosPrivateInstance.get(getteamlead);
      return resp.data;
    },
  });

  const handleSubmit = async () => {
    try {
      const resp = await axiosPrivateInstance.patch(
        `${assignteamlead}?teamLeadId=${selectedTeamLeadId}&clientId=${id}`
      );
      return resp.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (_data) => {
      queryClient.invalidateQueries({
        queryKey: ["teamleadlist"],
        refetchType: "active",
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["clientList"],
        refetchType: "active",
        exact: true,
      });

      toast.success("Assigned Team Lead successfully");
      navigate(`/client`);
    },
    onError: (error: any) => {
      console.error("Error:", error);
    },
  });

  const handleSwitchChange = (teamLeadId: any) => {
    setSelectedTeamLeadId(teamLeadId);
  };

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="Error Occurred" />;
  }
  if (isLoadingData) {
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
      <Title c="primary.0">Clients</Title>
      <Paper withBorder mt={20} p={20}>
        <Text fw={600} ta="center">
          Assigning Team Lead for
          <span style={{ color: "blue" }}> {clientData?.name} </span>
        </Text>
        <Text fw={500} mt={10} ta="center" c="dimmed" size="sm">
          Select the team leader to lead this client
        </Text>
        <Paper mt={20} p={10}>
          <Text fw={600}>Team Lead({data?.length})</Text>
          <Flex gap={20}>
            {data?.map((item: any, index: any) => (
              <Paper key={index} mt={10} withBorder p={10}>
                <Group justify="end">
                  <Switch
                    onChange={() => handleSwitchChange(item.id)}
                    checked={selectedTeamLeadId === item.id}
                  />
                </Group>
                <Center>
                  {item?.profile ? <Avatar src={item?.profile} /> : <Avatar />}
                </Center>
                <Text ta="center" c="primary.1"></Text>
                <Text ta="center" fw={600}>
                  {item.name}
                </Text>
                <Text ta="center" c="dimmed" size="sm">
                  {item.email}
                </Text>
              </Paper>
            ))}
          </Flex>
          <Center>
            <Button
              loading={isPending}
              onClick={() => mutate()}
              mt={20}
              bg="btncolor.1"
            >
              Confirm
            </Button>
          </Center>
        </Paper>
      </Paper>
    </>
  );
};

export default AssignTeamLead;
