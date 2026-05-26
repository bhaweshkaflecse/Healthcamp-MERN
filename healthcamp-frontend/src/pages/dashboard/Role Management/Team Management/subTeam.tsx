import {
  Box,
  Button,
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
import { AiFillEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { removeCustom, subteam } from "../../../../api/subteam";
import AssignCustom from "./AssignCustom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { axiosPrivateInstance } from "../../../../api";
// import {  useMediaQuery } from "@mantine/hooks";

const SubTeam = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [opened, { open: deleteModelOpen, close }] = useDisclosure(false);
  const [selectedMember, setSelectedMember] = useState("");
  // const isMobile = useMediaQuery("(max-width:1000px)");
  const [activeTab, setActiveTab] = useState<string>("subteam");

  const { isLoading, data } = useQuery({
    queryKey: [`subteam/${id}`],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(`${subteam}/${id}`);
        return response.data;
      }
    },
  });
  console.log(data);

  const handleRemoveMember = async () => {
    const resp = await axiosPrivateInstance.delete(
      `${removeCustom}/${selectedMember}`
    );
    return resp.data;
  };

  const {
    isPending,
    // data:customData,
    mutate: removeMutate,
  } = useMutation({
    mutationFn: () => handleRemoveMember(),
    mutationKey: ["removeCustomMember"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`subteam/${id}`],
        refetchType: "active",
        exact: true,
      });
      toast.success("Custom member deleted successfully");
      close();
    },
    onError: () => {
      close();
      toast.error("Unable to delete custom member");
    },
  });

  const handleRemovemember = async (id?: string) => {
    // console.log(id)
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
  if (!data || !data.admin) {
    return (
      <div>
        {" "}
        <Center h="50vh">
          <Box ta="center">
            <Loader color="blue" />
          </Box>
        </Center>
      </div>
    );
  }
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Group mt={20} bg="primary.0" p={10} justify="space-between">
        <Text c="white" fw={500} p={8}>
          {data.name}
        </Text>
        <Button
          c="blue"
          leftSection={<AiFillEdit size={16} color="primary.0" />}
          variant="default"
          onClick={() => navigate("/update-subteam", { state: data })}
        >
          Edit SubTeam
        </Button>
      </Group>

      <Paper p={40} withBorder>
        <Flex direction="column" align="center" gap={10}>
          <Text>{data.description}</Text>

          <Image
            mt={20}
            w={150}
            radius="50%"
            src={
              data?.team?.teamLeader?.profile ||
              "/admin/img/imagenotfound.png"
            }
          />
          <Text fw={600}>{data.team.name}</Text>
          <Text size="sm" c="dimmed">
            TeamLead: &nbsp;
            <span style={{ color: "black", fontWeight: "bold" }}>
              {data?.team?.teamLeader?.name}
            </span>
          </Text>
        </Flex>
        <Tabs mt={30} variant="pills" value={activeTab} defaultValue="subteam">
          <Center>
            <Tabs.List>
              <Tabs.Tab value="subteam" onClick={() => setActiveTab("subteam")}>
                Sub Team Members
              </Tabs.Tab>
              <Tabs.Tab value="custom" onClick={() => setActiveTab("custom")}>
                Add Custom Member
              </Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="subteam">
            <Flex mt={50} gap={40} wrap={"wrap"}>
              {data.admin?.map((item: any, index: any) => {
                return (
                  <React.Fragment key={index}>
                    <Paper withBorder>
                      <Flex direction="column" align="center" p={15}>
                        <Image
                          w={100}
                          radius="50%"
                          src={
                            item?.profile ||
                            "/admin/img/imagenotfound.png"
                          }
                        />
                        <Text fw={600}>{item.name}</Text>
                        <Text size="sm" c="primary.0">
                          {item.department}
                        </Text>
                        {/* <Text size="sm" c="dimmed">
                            {item.address}
                          </Text> */}
                      </Flex>
                    </Paper>
                  </React.Fragment>
                );
              })}
            </Flex>
            {data.custom?.length > 0 && (
              <>
                <Text mt={20}>Custom member</Text>
                <Flex mt={20} gap={40} wrap={"wrap"}>
                  {data.custom?.map((custom: any, index: any) => {
                    return (
                      <React.Fragment key={index}>
                        <Paper withBorder>
                          <Flex direction="column">
                            <Group justify="end">
                              <Flex justify="flex-end" w="100%">
                                <Menu shadow="md" width={150}>
                                  <Menu.Target>
                                    {/* <Button c="black" bg="none"> */}
                                    <Box mt={10}>
                                      <BsThreeDotsVertical size={20} />
                                    </Box>
                                    {/* </Button> */}
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Item
                                      onClick={() =>
                                        handleRemovemember(custom.id)
                                      }
                                      c="red"
                                    >
                                      Delete Member
                                    </Menu.Item>
                                  </Menu.Dropdown>
                                </Menu>
                              </Flex>
                            </Group>
                            <Flex
                              direction="column"
                              align="center"
                              pl={15}
                              pr={15}
                            >
                              <Image
                                w={100}
                                radius="50%"
                                src={
                                  custom?.profile ||
                                  "/admin/img/imagenotfound.png"
                                }
                              />
                              <Text mt={5} fw={600}>
                                {custom?.name}
                              </Text>
                              <Text size="sm" c="dimmed">
                                {custom?.email}
                              </Text>
                              <Text c="blue">{custom?.contact}</Text>
                              <Text size="sm" c="dimmed">
                                {custom?.address}
                              </Text>
                            </Flex>
                          </Flex>
                        </Paper>
                      </React.Fragment>
                    );
                  })}
                </Flex>
              </>
            )}
            <Center>
              <Button
                mt={40}
                variant="default"
                onClick={() => {
                  navigate(`/team-list/${data.team.id}`);
                }}
              >
                Back To Teams
              </Button>
            </Center>
          </Tabs.Panel>
          <Tabs.Panel value="custom">
            <Paper mt={20}>
              <AssignCustom setActiveTab={setActiveTab} />
            </Paper>
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

export default SubTeam;
