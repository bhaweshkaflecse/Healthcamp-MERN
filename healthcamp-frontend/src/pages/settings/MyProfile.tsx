import { Box, Button, Divider, Flex, Paper, Text, Title } from "@mantine/core";
import { Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { getAdminInfo } from "../../api/role";

const MyProfile = () => {
  const navigate = useNavigate();

  const adminData = async () => {
    const resp = await axiosPrivateInstance.get(getAdminInfo, {});

    return resp.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["AdminData"],
    queryFn: adminData,
  });

  if (isLoading) {
    return <Text>Loading data...</Text>;
  }

  if (error) {
    return <h2>Errorr..</h2>;
  }

  console.log(data);

  return (
    <Box>
      <Title my={12} size={30} c="blue">
        Settings
      </Title>
      <Paper p={40} withBorder>
        <Text size="lg" my="lg">
          My Profile
        </Text>

        <Paper p={80} withBorder>
          <Flex align="center" gap={20}>
            <Avatar size="lg" src={data?.profile} alt="it's me" />

            <Flex direction="column">
              <Text>{data?.name}</Text>
              <Text>{data?.email}</Text>
            </Flex>
          </Flex>

          <Divider mt={30} />

          <Flex direction="column" gap="lg" mt="lg">
            <Flex justify="space-between">
              <Text>Name</Text>
              <Text>{data?.name}</Text>
            </Flex>

            <Divider />

            <Flex justify="space-between">
              <Text>Email account</Text>
              <Text>{data?.email}</Text>
            </Flex>

            <Divider />

            <Flex justify="space-between">
              <Text>Phone Number</Text>
              <Text>{data?.contact}</Text>
            </Flex>

            <Divider />

            <Flex justify="space-between">
              <Text>Address</Text>
              <Text>{data?.address}</Text>
            </Flex>
          </Flex>

          <Button onClick={() => navigate("/settings")} mt={20}>
            Edit Profile
          </Button>
        </Paper>
      </Paper>
    </Box>
  );
};

export default MyProfile;
