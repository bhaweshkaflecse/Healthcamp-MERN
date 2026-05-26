import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Modal,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { CgDanger } from "react-icons/cg";
import { getTeam, removemember } from "../../../api/team";
import { getServices } from "../../../api/service";
import { getByTeamService } from "../../../api/subteam";
import { axiosPrivateInstance } from "../../../api";

const GetTeam = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState(null);
  const [showSubTeam, setShowSubTeasm] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [opened, { open: deleteModelOpen, close }] = useDisclosure(false);

  const { isLoading, data } = useQuery({
    queryKey: ["getateam"],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(`${getTeam}`);
        return response.data;
      }
    },
  });
  console.log(data);

  const { data: serviceData } = useQuery({
    queryKey: ["serviceList"],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(getServices);
        return response.data;
      }
    },
  });

  let {
    data: subTeams,
    isLoading: isSubTeamLoading,
    // error: subteamError,
    refetch,
  } = useQuery({
    queryKey: [`subTeamList${serviceId}`],
    queryFn: async () => {
      {
        if (serviceId) {
          setShowSubTeasm(false);
          const response = await axiosPrivateInstance.get(getByTeamService, {
            params: {
              serviceId,
              teamId: data.id,
            },
          });
          response.data && setShowSubTeasm(true);
          return response.data;
        }
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, serviceId]);

  const handleRemoveMember = async () => {
    const resp = await axiosPrivateInstance.delete(
      `${removemember}?adminId=${selectedMember}&teamId=${data.id}`,
      {}
    );
    return resp.data;
  };

  const {
    isPending,
    // data:customData,
    mutate: removeMutate,
  } = useMutation({
    mutationFn: () => handleRemoveMember(),
    mutationKey: ["removeMember"],
    onSuccess: () => {
      close();
      queryClient.invalidateQueries({
        queryKey: ["team"],
        refetchType: "active",
        exact: true,
      });
    },
    onError: () => {
      close();
      toast.error("Unable to delete member");
    },
  });

  const handleRemovemember = async (id?: string) => {
    id && setSelectedMember(id);
    deleteModelOpen();
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Group mt={20} bg="primary.0" p={10} justify="space-between">
        <Box>
          <Text c="white" fw={500} p={8}>
            {data.name}
          </Text>
        </Box>
        <Button
          c="blue"
          leftSection={<AiFillEdit size={16} color="primary.0" />}
          variant="default"
          onClick={() => navigate("/update-team", { state: { id: data.id } })}
        >
          Edit Team
        </Button>
      </Group>

      <Paper p={40} withBorder>
        <Flex direction="column" align="center">
          <Text size="sm" c="dimmed" p={8}>
            {data?.description}
          </Text>
          <Image
            mt={20}
            w={150}
            radius="50%"
            src={
              data?.teamLeader?.profile ||
              "/admin/img/imagenotfound.png"
            }
          />
          <Text size="sm" c="dimmed">
            Team Lead
          </Text>
          <Text fw={600}>{data?.teamLeader?.name}</Text>
          <Text size="sm" c="dimmed">
            {data?.teamLeader?.email}
          </Text>
        </Flex>

        <Tabs mt={30} variant="pills" defaultValue="team">
          <Center>
            <Tabs.List>
              <Tabs.Tab value="team">Team Members</Tabs.Tab>
              <Tabs.Tab value="subteam">Sub Teams</Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="team">
            <Flex mt={20} gap={40} wrap="wrap" justify="center">
              {data.admin?.map((item: any, index: any) => (
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
                        {item?.department == "unit_coordinator" && (
                          <Menu.Item
                            fw={600}
                            onClick={() =>
                              navigate(`/view-unitMembers/${item.id}`, {
                                state: { id: item.id },
                              })
                            }
                          >
                            View Team
                          </Menu.Item>
                        )}

                        <Menu.Item
                          onClick={() => handleRemovemember(item.id)}
                          c="red"
                        >
                          Delete Member
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>

                    <Image
                      w={100}
                      h={100}
                      radius="50%"
                      src={
                        item?.profile || "/admin/img/imagenotfound.png"
                      }
                      style={{ objectFit: "cover", border: "2px solid #ddd" }}
                    />

                    {/* User Info */}
                    <Text fw={700} size="lg" mt="md">
                      {item.name}
                    </Text>
                    <Text size="sm" c="primary.0" fw={600}>
                      {item.department}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.address}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="subteam">
            {serviceData?.servicesWithCalendarStatus?.map((item1: any, index1: any) => {
              return (
                <Group key={index1} gap={0} mt={10} justify="space-between">
                  <Paper w={"100%"} p={20} bg="blue">
                    <Group justify="space-between">
                      <Text c="white">{item1.name}</Text>

                      <FaChevronDown
                        color="white"
                        onClick={() => {
                          setShowSubTeasm(!showSubTeam);
                          setServiceId(item1.id);
                        }}
                      />
                    </Group>
                  </Paper>
                  {serviceId == item1.id && showSubTeam && (
                    <Paper
                      withBorder={serviceId == item1.id ? true : false}
                      p={10}
                      w="100%"
                    >
                      {isSubTeamLoading ? (
                        <Text>Loading....</Text>
                      ) : subTeams.length > 0 ? (
                        subTeams?.map((subteam: any) => (
                          <Paper
                            bg="#E8E8E8"
                            key={subteam.id}
                            mt={10}
                            p={10}
                            w="100%"
                            onClick={() => {
                              navigate(`/subteam/${subteam.id}`);
                            }}
                          >
                            <Text fw={400} mt={2} c="primary.0">
                              {subteam.name}
                            </Text>
                          </Paper>
                        ))
                      ) : (
                        <Text c={"dimmed"}>Sub teams not found</Text>
                      )}
                    </Paper>
                  )}
                </Group>
              );
            })}
          </Tabs.Panel>
        </Tabs>
      </Paper>
      <Modal opened={opened} onClose={close}>
        <Center>
          <CgDanger size={25} color="red" />
        </Center>
        <Text mt={10} fw={600} ta="center">
          Are you sure you want to delete?
        </Text>
        <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
          The action of deletion cannot be undone. Are you sure you want to
          proceed deleting this service?
        </Text>
        <Group mt={20} justify="center">
          <Button variant="default" onClick={() => close()}>
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={() => removeMutate()}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default GetTeam;
