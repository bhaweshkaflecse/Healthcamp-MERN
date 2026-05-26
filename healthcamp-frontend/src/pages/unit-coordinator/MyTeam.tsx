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
import { axiosPrivateInstance } from "../../api";
import { getUnitSubteamMember } from "../../api/team";

const MyTeam = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`getUnitCoordinatorTeam`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getUnitSubteamMember}`
      );
      return response.data;
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
    return (
      <Alert title="Error" color="red" mt="md">
        {error.message}
      </Alert>
    );
  }

  return (
    <Paper p={20} withBorder shadow="md" radius="md">
      <Title size="h2" c="#6092FE">
        View Unit Members
      </Title>

      <Center mt={20}>
        <Image
          src="/admin/img/imagenotfound.png"
          w={150}
          radius="50%"
          alt="Unit Coordinator"
        />
      </Center>

      <Text fw={600} ta="center" mt={10}>
        Sanjeev Ray
      </Text>

      <Text ta="center" size="sm" c="dimmed">
        sanjeev@ray.com
      </Text>

      <Text ta="center" mt={5} c="blue" fw={600}>
        Unit Coordinator
      </Text>

      <Box mt={30}>
        <Text fw={600}>Team Lead</Text>
        <Paper maw={200} p={15} mt={10} withBorder shadow="xs" radius="md">
          <Flex direction="column" align="center" ta="center">
            <Image
              w={60}
              h={60}
              radius="50%"
              src={
                data?.subTeam[0]?.team?.teamLeader?.profile ||
                "/admin/img/imagenotfound.png"
              }
              alt="Team Lead"
              style={{ objectFit: "cover", border: "2px solid #ddd" }}
            />
            <div>
              <Text size="lg" fw={600}>
                {data?.subTeam[0]?.team?.teamLeader?.name}
              </Text>
              <Text size="sm" c="dimmed">
                {data?.subTeam[0]?.team?.teamLeader?.email}
              </Text>
            </div>
          </Flex>
        </Paper>
      </Box>

      <Text fw={600} mt={30}>
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
              style={{ transition: "transform 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Flex direction="column" align="center">
                <Menu shadow="md" width={150} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      radius="xl"
                      pos="absolute"
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
            No subteam members for this unit coordinator are assigned.
          </Text>
        )}
      </Flex>
    </Paper>
  );
};

export default MyTeam;
