import { Box, Button, Divider, Flex, Paper, Text, Title } from "@mantine/core";
import { Avatar } from "@mantine/core";
import { getAdminInfo } from "../../../api/role";
import { useQuery } from "@tanstack/react-query";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const Profile = () => {
  const GetAdminInfo = async () => {
    try {
      const resp = await axiosPrivateInstance.get(getAdminInfo);

      return resp.data;
    } catch (err) {
      console.log("Error occured", err);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAdminInfo"],
    queryFn: GetAdminInfo,
  });

  console.log(data);

  if (isLoading) {
    <Text>Data is loading...</Text>;
  }

  if (error) {
    <Text>An error occured....</Text>;
  }

  const navigate = useNavigate();

  return (
    <Box px={40}>
      <Title c="blue" my={20} size="h2">
        Settings
      </Title>

      <Paper p={60} withBorder>
        <Text size="xl" mb={20}>
          My Profile
        </Text>

        <Paper p={40} withBorder>
          <Flex align="center" direction="column">
            <Flex gap="sm" justify="center" align="center">
              <Avatar
                w={80}
                h={80}
                src="https://cdn.openart.ai/stable_diffusion/18d45fc8e03d0f93cb1b170c810720b55d1822c7_2000x2000.webp"
                alt="it's me"
              />

              <Box>
                <Text>{data?.name}</Text>
                <Text c="dimmed">{data?.email}</Text>
              </Box>

              <Divider my="md" />
            </Flex>
            <Flex
              mt={30}
              gap="lg"
              w={400}
              direction="column"
              justify="space-between"
            >
              <Flex justify="space-between">
                <Text>Name</Text>
                <Text c="dimmed">{data?.name}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Email</Text>
                <Text c="dimmed">{data?.email}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Phone</Text>
                <Text c="dimmed">+977-9843249388</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Address</Text>
                <Text c="dimmed">{data?.address}</Text>
              </Flex>

              <Box>
                <Button
                  onClick={() => navigate("/settings")}
                  leftSection={<CiEdit />}
                >
                  Edit Profile
                </Button>
              </Box>
            </Flex>
          </Flex>
        </Paper>
      </Paper>
    </Box>
  );
};

export default Profile;
