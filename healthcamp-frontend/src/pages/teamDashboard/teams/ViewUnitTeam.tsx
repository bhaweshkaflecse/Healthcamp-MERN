import {
  ActionIcon,
  Alert,
  Box,
  Card,
  Center,
  Flex,
  Image,
  Loader,
  Menu,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { BsThreeDotsVertical } from "react-icons/bs";
import { axiosPrivateInstance } from "../../../api";
import { getUnitCoordinatorTeam } from "../../../api/team";
import { useLocation } from "react-router-dom";

const ViewTeam = () => {
  const location = useLocation();
  const unitCoordinatorId = location.state.id;

  const { data, isLoading, error } = useQuery({
    queryKey: [`getUnitCoordinatorTeam/${unitCoordinatorId}`],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(
          `${getUnitCoordinatorTeam}/${unitCoordinatorId}`
        );
        return response.data;
      }
    },
  });
  console.log(data);

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
    <Alert title="Error" color="red" mt="md">
      {error.message}
    </Alert>;
  }

  return (
    <Paper p={20} withBorder>
      <Title size="h2" c="#6092FE">
        View SubTeam Members
      </Title>
      <Center>
        <Image src={data?.profile} w={150} radius="50%" />
      </Center>
      <Text fw={600} ta="center" mt={5}>
        {data?.name}
      </Text>
      <Text ta="center" size="sm" c="dimmed">
        {data?.email}
      </Text>
      <Text ta="center" mt={5} c="blue">
        Unit Coordinator
      </Text>

      <Text fw={600} mt={20}>
        SubTeam Members
      </Text>

      <Flex mt={20} gap={20} wrap="wrap">
        {data?.subTeam[0]?.custom && data.subTeam[0].custom.length > 0 ? (
          data.subTeam[0].custom.map((item: any, index: any) => (
            <Card
              miw={200}
              key={index}
              shadow="md"
              padding="sm"
              radius="md"
              withBorder
            >
              <Flex direction="column" align="center">
                <Menu shadow="md" width={150} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      radius="xl"
                      pos={"absolute"}
                      style={{ top: "0px", right: "0px" }}
                    >
                      <BsThreeDotsVertical size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item c="red">Delete Member</Menu.Item>
                  </Menu.Dropdown>
                </Menu>

                <Image
                  w={100}
                  h={100}
                  radius="50%"
                  src={item?.profile || "/admin/img/imagenotfound.png"}
                  style={{ objectFit: "cover", border: "2px solid #ddd" }}
                />

                {/* User Info */}
                <Text fw={700} size="lg" mt="md">
                  {item?.name}
                </Text>
                <Text size="sm" c="dimmed" fw={600}>
                  {item?.email}
                </Text>
                <Text c="primary.0">{item?.contact}</Text>
              </Flex>
            </Card>
          ))
        ) : (
          <Text size="md" c="red">
            No subteam members for this unit coordinator is assigned.
          </Text>
        )}
      </Flex>
    </Paper>
  );
};

export default ViewTeam;
