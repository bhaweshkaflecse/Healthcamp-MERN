import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignteamlead, getclient, getteamlead } from "../../../api/client";
import { IoAdd } from "react-icons/io5";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";
import { CiEdit } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { toast } from "react-toastify";

const ClientInformation = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTeamLeadId, setSelectedTeamLeadId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: [`clientInfo/${id}`, id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getclient}/${id}`, {});
      return response.data;
    },
  });
  console.log(data);

  const { data: TeamLeadData } = useQuery({
    queryKey: ["teamleadlist"],
    queryFn: async () => {
      const resp = await axiosPrivateInstance.get(getteamlead);
      return resp.data;
    },
  });

  const handleSwitchChange = (teamLeadId: any) => {
    setSelectedTeamLeadId(teamLeadId);
  };

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
        queryKey: [`clientInfo/${id}`, id],
        refetchType: "active",
        exact: true,
        enabled: !id,
      });
      queryClient.invalidateQueries({
        queryKey: ["clientList"],
        refetchType: "active",
        exact: true,
      });
      close();
      navigate(`/client`);
      toast.success("Assigned Team Lead successfully");
    },
    onError: (error: any) => {
      console.error("Error:", error);
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
    return <ErrorAxios error={error} />;
  }
  return (
    <>
      <Modal
        w={1000}
        opened={opened}
        onClose={close}
        title={
          <Title
            size="h2"
            style={{ backgroundColor: "white", color: "#6092FE" }}
          >
            Change Team Lead
          </Title>
        }
      >
        <Paper withBorder mt={20} p={20}>
          <Text fw={600} ta="center">
            Assigning Team Lead for
            <span style={{ color: "blue" }}> {data?.name} </span>
          </Text>
          <Text fw={500} mt={10} ta="center" c="dimmed" size="sm">
            Select the team leader to lead this client
          </Text>
          <Paper mt={20} p={10}>
            {TeamLeadData?.map((item: any, index: any) => (
              <Group key={index} justify="space-between" p={10}>
                <Text>{item?.name}</Text>
                <Switch
                  onChange={() => handleSwitchChange(item.id)}
                  checked={selectedTeamLeadId === item.id}
                />
              </Group>
            ))}
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
      </Modal>
      <Title c="primary.0" size="h3">
        Clients
      </Title>
      <Paper withBorder p={20} mt={10}>
        <Group justify="space-between">
          <Text fw={600} c="primary.1">
            My Clients
          </Text>
          {!data?.teamLead ? (
            <Button
              onClick={() => navigate(`/assignteamlead/${id}`)}
              bg="btncolor.1"
              leftSection={<IoAdd size={20} />}
            >
              Assign Team Lead
            </Button>
          ) : (
            <Group>
              <Badge p={14} bg="btncolor.1">
                Assigned to {data?.teamLead?.name}
              </Badge>

              <CiEdit onClick={open} size={30} />
            </Group>
          )}
        </Group>
        <Group mt={10} justify="center" bg="primary.0" p={15}>
          <Image w={30} radius="50%" src={data?.profile || <Avatar />} />
          <Text fw={500} c="white">
            {data?.name}
          </Text>
        </Group>
        <Paper withBorder p={10}>
          <Text mt={20} size="sm" c="dimmed" ta="center" fw={500}>
            Client Full Information
          </Text>
          <Center>
            <Paper mt={10} withBorder p={10}>
              <Group justify="space-between" gap={30}>
                <Text size="sm" c="dimmed">
                  Full Name
                </Text>
                <Text size="sm" c="dimmed">
                  {data?.name}
                </Text>
              </Group>
              <Divider mt={5} />
              <Group justify="space-between" gap={30} mt={10}>
                <Text size="sm" c="dimmed">
                  Email Account
                </Text>
                <Text size="sm" c="dimmed">
                  {data?.email}
                </Text>
              </Group>
              <Divider mt={5} />
              <Group justify="space-between" gap={30} mt={10}>
                <Text size="sm" c="dimmed">
                  Address
                </Text>
                <Text size="sm" c="dimmed">
                  {data?.address}
                </Text>
              </Group>
            </Paper>
          </Center>
        </Paper>
      </Paper>
    </>
  );
};

export default ClientInformation;
