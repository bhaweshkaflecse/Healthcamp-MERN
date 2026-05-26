import {
  Button,
  Center,
  Group,
  Paper,
  Space,
  Table,
  Title,
  ScrollArea,
  Flex,
  Image,
  Text,
  Modal,
  Box,
  Loader,
} from "@mantine/core";
import { Avatar, Tooltip } from "@mantine/core";
import { MdGroups } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getalladmin, getTechnicalMembers } from "../../../api/role";
import { getteam } from "../../../api/team";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";

const RoleManagement = () => {
  const navigate = useNavigate();

  const [showTeams, setShowTeams] = useState(false);
  const [opened, { close }] = useDisclosure(false);
  const pageSize = 10;
  const page = 1;

  const handleTeam = () => {
    setShowTeams(true);
  };
  const handleStaff = () => {
    setShowTeams(false);
  };

  // Fetch all admin roles
  const { data: roledata, isLoading } = useQuery({
    queryKey: ["memberList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getalladmin, {});
      return response.data;
    },
  });

  // Fetch technical members
  const { data: TechnicalMembersData, isLoading: isTechnicalLoading } = useQuery({
    queryKey: ["TechnicalmemberList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getTechnicalMembers}?pageSize=${pageSize}&page=${page}`,
        {}
      );
      return response.data;
    },
  });

  console.log("Technical Members Data:", TechnicalMembersData);

  // Get all teams (commented out but kept for future use)
  const { data: teamListData, error } = useQuery({
    queryKey: ["teamList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getteam, {});
      return response.data;
    },
  });

  if (isLoading || isTechnicalLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="Error Occurred" />;
  }

  // ✅ Create Technical Member role object from fetched data
  const technicalMemberRole = {
    Roles: "Technical Member",
    value: "technical_member",
    user: TechnicalMembersData?.customMembers || [],
  };

  // ✅ Combine roledata with Technical Members
  const allRolesData = roledata ? [...roledata, technicalMemberRole] : [technicalMemberRole];

  // ✅ Create table rows with combined data
  const rows = allRolesData?.map((item: any, index: any) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/member-list/${item.value}`)}
      >
        {`${item.Roles}(${item.user?.length || 0})`}
      </Table.Td>
      <Table.Td>
        <Tooltip.Group openDelay={300} closeDelay={100}>
          <Avatar.Group spacing="lg">
            {item.user?.slice(0, 5)?.map((item2: any, index2: any) => {
              return (
                <Tooltip key={index2} label={item2.name} withArrow>
                  <Avatar src={item2.profile} radius="xl" />
                </Tooltip>
              );
            })}
            {/* Show +X if more than 5 users */}
            {item.user?.length > 5 && (
              <Avatar radius="xl" color="blue">
                +{item.user.length - 5}
              </Avatar>
            )}
          </Avatar.Group>
        </Tooltip.Group>
      </Table.Td>
      <Table.Td>
        <Center>
          <Button variant="transparent">
            <u onClick={() => navigate(`/member-list/${item.value}`)}>
              View More
            </u>
          </Button>
        </Center>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper mt={10} withBorder w="100%">
        <Group p={10} justify="space-between">
          <Group>
            <Button
              onClick={handleStaff}
              rightSection={<MdGroups size={20} />}
              variant="transparent"
            >
              Staffs
            </Button>
            <Button onClick={handleTeam} variant="transparent">
              Units
            </Button>
          </Group>

          {!showTeams && (
            <Button
              onClick={() => navigate("/assign")}
              color="green"
              leftSection={<IoMdAdd size={16} />}
            >
              Create New Staff
            </Button>
          )}
          {showTeams && (
            <Button
              color="green"
              onClick={() => navigate("/create-team")}
              leftSection={<IoMdAdd size={16} />}
            >
              Create New Team
            </Button>
          )}
        </Group>
        <Space h="sm" />
        {!showTeams && (
          <ScrollArea miw={300}>
            <Table
              horizontalSpacing="xl"
              withRowBorders={false}
              style={{ overflowX: "auto", width: "100%" }}
            >
              <Table.Thead bg="#F3F6F9">
                <Table.Tr>
                  <Table.Th p="md">S.N.</Table.Th>
                  <Table.Th>Roles</Table.Th>
                  <Table.Th>Users</Table.Th>
                  <Table.Th>
                    <Center>Action</Center>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>
      <Modal opened={opened} onClose={close}>
        <Text mt={10} fw={600} ta="center">
          Are You want to delete Razin Ghising?
        </Text>
        <Center mt={10}>
          <Image src="img/teamlead.jpg" w={70} radius="50%" />
        </Center>
        <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
          The action of deletion cannot be undone. Are you sure you want to
          proceed deleting this user?
        </Text>
        <Group mt={20} justify="center">
          <Button variant="default" bg="whitesmoke">
            Cancel
          </Button>
          <Button onClick={() => navigate("/deleteuser")} color="red">
            Delete
          </Button>
        </Group>
      </Modal>
    {showTeams && (
        <Flex gap={10} justify="space-between" wrap="wrap">
          {teamListData?.map((item: any, index: any) => (
            <Flex
              w={300}
              mt={20}
              bg="#E5ECFA"
              align="center"
              key={index}
              direction="column"
            >
              <Text fw={500} p={8} w="100%" ta="center" bg="white">
                <span
                  style={{
                    color: "white",
                    background: "#218BE6",
                    padding: "5px 10px 5px 10px",
                  }}
                >
                  {item?.name}
                </span>
              </Text>
              <Flex gap={10} mt={10} p={10} justify="center" align="center">
                <Image radius="50%" src={item?.teamLeader?.profile} w={50} />
                <Box>
                  <Text c="#7E7E7E" size="sm">
                    Team Leader
                  </Text>
                  <Text>{item?.name}</Text>
                </Box>
              </Flex>
              <Text c="dimmed" p={20} size="sm" maw={320}>
                {item?.description}
              </Text>
              <Button
                bg="#218BE6"
                mt={20}
                mb={20}
                onClick={() => navigate(`/team-list/${item.id}`)}
              >
                View More
              </Button>
            </Flex>
          ))}
        </Flex>
      )} 
    </>
  );
};

export default RoleManagement;