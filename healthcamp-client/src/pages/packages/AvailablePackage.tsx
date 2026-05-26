import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Loader,
  Paper,
  Text,
  Title,
  Container,
  Stack,
} from "@mantine/core";
import { useContext } from "react";
import { axiosPrivateInstance } from "../../api";
import { getpackage } from "../../api/package";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { KycContext } from "../../providers/context/KycContext";
import { useNavigate } from "react-router-dom";

const AvailablePackage = () => {
  const context = useContext(KycContext);
  const navigate = useNavigate();

  const getAvailablePackage = async () => {
    const resp = await axiosPrivateInstance.get(getpackage);
    return resp.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["availablePackage"],
    queryFn: getAvailablePackage,
  });

  interface ErrorResponse {
    message: string;
  }
  const isAxiosError = (error: any): error is AxiosError<ErrorResponse> => {
    return (error as AxiosError).isAxiosError;
  };

  const handleViewMore = (id: any) => {
    navigate(`/package/${id}`);
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" size="xl" />
      </Center>
    );
  }

  if (error && isAxiosError(error)) {
    return (
      <Center h="50vh">
        <Alert variant="light" color="red" title="Error">
          {error.response?.data?.message || "An error occurred"}
        </Alert>
      </Center>
    );
  }

  return (
    <Container size="lg" py={40}>
      <Title order={2} ta="center" c="blue" mb={30}>
        Available Packages
      </Title>
      <Stack m={20}>
        {data?.packages?.map((pack: any) => (
          <Paper key={pack.id} shadow="md" radius="md" withBorder p={20}>
            <Flex align="center" gap={20}>
              <Image width={180} height={120} fit="contain" src={pack.img} radius="md" />
              <Box flex={1}>
                <Text size="lg" w={600}>{pack.name}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {pack.description}
                </Text>
              </Box>
              <Button
                color={context?.isKycVerified ? "blue" : "gray"}
                disabled={!context?.isKycVerified}
                onClick={() => handleViewMore(pack.id)}
              >
                View More
              </Button>
            </Flex>
          </Paper>
        ))}
      </Stack>
      <Center mt={40}>
        <Button onClick={() => navigate("/dashboard")} variant="outline" color="blue">
          Back to Dashboard
        </Button>
      </Center>
    </Container>
  );
};

export default AvailablePackage;