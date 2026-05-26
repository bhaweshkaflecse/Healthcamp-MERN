import {
  Box,
  Group,
  Paper,
  Text,
  Flex,
  Image,
  Divider,
  Title,

  Button,
  Center,
  Loader
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { clientinfo } from "../../api/auth";
import ErrorAxios from "../../components/ErrorAxios";
import { useNavigate } from "react-router-dom";
const KycDetails = () => {

  const navigate = useNavigate();

  const { isLoading, data, error } = useQuery({
    queryKey: ["kycStatus"],
    queryFn: async () => {

      const response = await axiosPrivateInstance.get(clientinfo, {

      });
      return response.data;
    },
  });
  // console.log('my name is data', )
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    )
  }
  if (error) {
    <ErrorAxios error={error} fallbackMessage="An error occurred" />
  }
  return (
    <Paper withBorder p={60}>
      {
        data?.kyc?.kycStatus === 'approved' ? <Title mt={10} size="h2" c="green">
          Your KYC is Approved
        </Title> : <Title mt={10} size="h2" c="#FF5151">
          Your KYC Approval is {
            data?.kyc?.kycStatus
          }
        </Title>
      }




      <Text mt={10} fw={500}>
        My Details
      </Text>

      <Group justify="space-between" mt={10}>
        {/* <Paper h={180} p={20} withBorder>
          <Center>
            {
              data?.profile == null ? <Image w={170} src={data?.kyc?.document || "https://thehimalayantimes.com/thehimalayantimes/uploads/images/2023/09/07/26282.jpg"} /> : <Image w={100} src={data?.profile} />
            }
            
          </Center>
          <Text>{data?.name}</Text>
        </Paper> */}

        <Paper h={220} p={16} withBorder>
          <Group gap={90}>
            <Flex direction="column" gap={7}>
              <Text fw={600}>Contact Information</Text>
              <Box >
                <Text size="sm">Name</Text>
                <Text c="#878787" size="sm">
                  {data?.name}
                </Text>
              </Box>
              <Box mt={10}>
                <Text size="sm">Email</Text>
                <Text c="#878787" size="sm">
                  {data?.email}
                </Text>
              </Box>
              <Box>
                <Text size="sm">Contact</Text>
                <Text c="#878787" size="sm">
                  {data?.contact}
                </Text>
              </Box>
            </Flex>

            <Divider orientation="vertical" />

            <Flex direction="column">
              <Text fw={600}>Adress Information</Text>
              <Group align="top" gap={100}>
                <Flex direction="column" gap={7}>
                  <Box mt={10}>
                    <Text size="sm">Province/State</Text>
                    <Text c="#878787" size="sm">
                      {data?.kyc?.province}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">Street Address</Text>
                    <Text c="#878787" size="sm">
                      {data?.kyc?.streetAddress}
                    </Text>
                  </Box>

                  <Box>
                    <Text size="sm">City</Text>
                    <Text c="#878787" size="sm">
                      {data?.kyc?.city}
                    </Text>
                  </Box>
                </Flex>

              </Group>
            </Flex>
          </Group>
        </Paper>
      </Group>


      <Paper mt={20} withBorder p={20}>
        <Text fw={600}>Document Details</Text>

        <Box>
          <Text mt={10} size="sm">
            Document Type
          </Text>
          <Text c="#878787" size="sm">
            {data?.kyc?.documentType}
          </Text>
        </Box>

        <Text mt={10} size="sm">
          Registration Document Images:
        </Text>

        <Flex gap="xl">

          {
            data?.kyc?.kycDocument?.map((kycDoc: any) => (
              <Image w={80} src={kycDoc.document} />
            ))
          }
        </Flex>

        <Group mt={10} justify="end">


          {/* <Button color="#E8E8E8" c="black">
              {" "}
              Edit Details
            </Button> */}
          <Button onClick={() => navigate('/dashboard')} color="#4CAF50"> Dashboard</Button>
        </Group>
      </Paper>
    </Paper>
  );
};

export default KycDetails;
