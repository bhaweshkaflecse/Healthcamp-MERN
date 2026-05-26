import {
  Alert,
  Box,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getclient } from "../../api/client";
import { useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";

const ClientInformation = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: [`teamClientInfo/${id}`, id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getclient}/${id}`, {});
      return response.data;
    },
  });
  console.log(data)
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
    return (
      <Alert variant="light" title="Something error occured" color="red">
        {/* @ts-ignore */}
        {error?.response.data.message}
      </Alert>
    );
  }
  return (
    <>
      <Title c="primary.0" size="h3">
        Clients
      </Title>
      <Paper withBorder p={20} mt={10}>
        <Text fw={600} c="primary.1">
          My Clients
        </Text>
        <Group mt={10} justify="center" bg="primary.0" p={15}>
          <Image w={30} radius="50%" src={data?.profile} />
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
