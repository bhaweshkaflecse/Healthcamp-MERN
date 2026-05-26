import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Image,
  Loader,
  Paper,
  Text,
  Title,
  Stack,
  Group,
} from "@mantine/core";
import { FaHandHoldingHeart, FaCartArrowDown } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getIndividualPackageAPI } from "../../api/package";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const Service = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getDetails = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getIndividualPackageAPI}/${id}`
    );
    return resp.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`individualPackage/${id}`],
    queryFn: getDetails,
  });

  if (isLoading) {
    return (
      <Center h="60vh">
        <Loader color="blue" size="xl" />
      </Center>
    );
  }

  if (error && isAxiosError(error)) {
    return (
      <Center h="60vh">
        <Alert variant="filled" color="red" title="Error">
          {error.response?.data?.message || "An error occurred"}
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={40}>
      <Paper withBorder p={40} radius="md" shadow="md">
        <Stack m={30}>
          <Title ta="center" c="blue">
            {data?.name}
          </Title>
          <Text ta="center" c="dimmed" size="lg">
            {data?.description}
          </Text>

          <Center>
            <Image radius="md" h={350} w={350} src={data?.img} />
          </Center>

          <Box>
            <Group m={10} mb={10}>
              <FaHandHoldingHeart color="#0e939b" size={24} />
              <Text size="lg" fw={600}>
                Services Included ({data?.service?.length})
              </Text>
            </Group>
            <Stack m={8} pl={40}>
              {data?.service?.map((servi:any) => (
                <Group key={servi.id} m={10}>
                  <IoCheckmarkDoneCircleSharp color="#6998fe" size={18} />
                  <Text color="dimmed">{servi.name}</Text>
                </Group>
              ))}
            </Stack>
          </Box>

          <Box>
            <Group m={10} mb={10}>
              <FaHandHoldingHeart color="#0e939b" size={24} />
              <Text size="lg" fw={600}>
                Price Range
              </Text>
            </Group>
            <Paper withBorder p={20} radius="md">
              <Stack m={10}>
                {data?.price?.map((pric:any) => (
                  <Box key={pric.id}>
                    <Text>
                      <b>{pric.min} - {pric.max}</b> Participants
                    </Text>
                    <Text fw={600}>{pric.price}</Text>
                    <Divider />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          <Center mt={20}>
            <Button
              onClick={() =>
                navigate("/your-packages", {
                  state: { price: data?.price, id: data?.id },
                })
              }
              color="blue"
              leftSection={<FaCartArrowDown size={18} />}
              size="lg"
            >
              Purchase Package
            </Button>
          </Center>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Service;