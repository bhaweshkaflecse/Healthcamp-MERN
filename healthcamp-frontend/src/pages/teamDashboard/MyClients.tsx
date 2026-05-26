import {
  Alert,
  Box,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../api/team";
import { axiosPrivateInstance } from "../../api";

const MyClients = () => {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["teamleadclients"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getClients, {});
      return response.data;
    },
  });console.log(data)

  if (error) {
    <Alert variant="light" color="red" title="Error Due To ">
      {error.message}
    </Alert>;
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
      <Title c="primary.0" size="h3">
        Clients
      </Title>
      <Paper p={20} mt={10} withBorder>
        <Text c="primary.1"> My Clients ({data?.length})</Text>
        {data?.clients?.map((item: any, index: any) => {
          return (
            <Paper key={index} mt={10} p={10} bg="#e5ecfa">
              <Group justify="space-between">
                <Group>
                  <Image
                    radius="50%"
                    src={item?.profile || "img/imagenotfound.png"}
                    w={50}
                  />
                  <Box>
                    <Text>{item.name}</Text>
                    <Text size="sm" c="dimmed">
                      {item.email}
                    </Text>
                  </Box>
                </Group>
                <FaArrowCircleRight
                  onClick={() => navigate(`/clientinfo/${item.id}`)}
                  color="white"
                  size={25}
                />
              </Group>
            </Paper>
          );
        })}
      </Paper>
    </>
  );
};

export default MyClients;
``