import {
  Box,
  Paper,
  Text,
  Flex,
  Image,
  Grid,
  Space,
  Divider,
  Title,
  Center,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getclient } from "../../../api/client";
import { useParams } from "react-router-dom";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import Loader from "../../../components/Loader";
import { axiosPrivateInstance } from "../../../api";

const ClientDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["kycPendingClient", id],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${getclient}/${id}`, {});
      return response.data;
    },
  });
  console.log(data);

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader />
        </Box>
      </Center>
    );
  }
  if (error) {
    return <ErrorAxios error={error} fallbackMessage="Error Occurred" />;
  }
  return (
    <Box>
      <Title size="h2" c="#6092FE">
        KYC Approval Status
      </Title>

      <Title size="h4" mt={10} c="#f9a618">
        Kyc is {data?.kyc?.kycStatus}
      </Title>

      <Paper mt={10} p={20} withBorder>
        <Title size="h3" c="dimmed">
          Client Details
        </Title>

        <Grid>
          <Grid.Col p={20} span={{ base: 12, md: 12, lg: 3 }}>
            <Paper mt={10} h={220} withBorder>
              <Flex direction="column" justify="center" align="center" mt="xl">
                <Image
                  w={90}
                  radius="50%"
                  src={data?.profile || "/admin/img/imagenotfound.png"}
                ></Image>

                <Text fw={500} ta="center" p={20}>
                  {data?.kyc.name}
                </Text>
              </Flex>
            </Paper>
          </Grid.Col>

          <Grid.Col p={20} span={{ base: 12, md: 12, lg: 8.5 }} mt={10}>
            <Paper withBorder>
              <Flex
                justify="space-between"
                p={20}
                // gap={200}
              >
                <Box p={10}>
                  <Text fw={500} size="md">
                    Contact Information
                  </Text>
                  <Space h="md" />
                  <Text>Email</Text>
                  <Text mt={4} c="dimmed">
                    {data?.email}
                  </Text>

                  <Space h="md" />
                  <Text>Contact</Text>

                  <Text c="dimmed">{data?.contact}</Text>
                </Box>

                <Divider orientation="vertical" />

                <Box>
                  <Text fw={500} size="md">
                    Address Information
                  </Text>
                  <Space h="md" />

                  <Box>
                    <Text>Province/State </Text>
                    <Text c="dimmed">{data?.kyc.province}</Text>
                    <Space h="md" />

                    <Text>Street Address</Text>
                    <Text c="dimmed">{data?.kyc.streetAddress}</Text>

                    <Text>City </Text>
                    <Text c="dimmed">{data?.kyc.city}</Text>
                  </Box>
                </Box>
              </Flex>
            </Paper>
          </Grid.Col>

          <Grid.Col ml={9} span={11.4}>
            <Paper p={18} withBorder>
              <Text fw={500} size="md" mt={30}>
                Document Details
              </Text>
              <Flex direction="row" justify="space-between" w="42%">
                <Box mt={20}>
                  <Text>Document Type</Text>
                  <Text c="dimmed">{data?.kyc.documentType}</Text>
                </Box>
              </Flex>

              <Flex justify="space-between" mt={30}>
                <Box>
                  <Text>Registration Document Image</Text>
                  <Image
                    mt={10}
                    w={150}
                    src={data?.kyc?.kycDocument?.map(
                      (item: any) =>
                        item.document || "/admin/img/imagenotfound.png"
                    )}
                  />
                </Box>
              </Flex>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ClientDetails;
