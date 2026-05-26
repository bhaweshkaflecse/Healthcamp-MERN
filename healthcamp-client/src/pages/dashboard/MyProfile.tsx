import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { infoClientAPI } from "../../api/users";
import { useQuery } from "@tanstack/react-query";

const MyProfile = () => {
  const navigate = useNavigate();

  const accessTokenn = async () => {
    const resp = await axiosPrivateInstance.get(infoClientAPI);

    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: accessTokenn,
  });

  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  return (
    <Paper p={20}>
      <Title size="h4">My Profile</Title>
      <Center>
        <Paper p={10} mt={10} withBorder>
          <Group gap={80}>
            <Group>
              <Image h={50} w={50} radius={40} src={data?.profile} />
              <Box>
                <Text>{data?.name}</Text>
                <Text c="dimmed" size="sm">
                  {data?.email}
                </Text>
              </Box>
            </Group>
            <Button
              onClick={() => navigate("/editprofile")}
              leftSection={<CiEdit size={20} />}
            >
              Edit Profile
            </Button>
          </Group>
          <Divider mt={10} c="dimmed" />
          <Group mt={10} p={10} justify="space-between">
            <Text>Name</Text>

            <Text c="dimmed">{data?.name}</Text>
          </Group>
          <Divider />
          <Group p={10} justify="space-between">
            <Text>Email</Text>

            <Text c="dimmed">{data?.email}</Text>
          </Group>
          <Divider />
          <Group p={10} justify="space-between">
            <Text>Mobile Number</Text>
            <Text c="dimmed">{data?.contact}</Text>
          </Group>
          <Divider />
          <Group p={10} justify="space-between">
            <Text>Address</Text>
            <Text c="dimmed">{data?.address}</Text>
          </Group>
        </Paper>
      </Center>
    </Paper>
  );
};

export default MyProfile;
