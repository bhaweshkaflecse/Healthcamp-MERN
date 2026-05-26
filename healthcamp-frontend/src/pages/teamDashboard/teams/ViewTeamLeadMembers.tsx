import {
  ActionIcon,
  Box,
  Card,
  Center,
  Flex,
  Image,
  Loader,
  Menu,
  Paper,
  Tabs,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { BsThreeDotsVertical } from "react-icons/bs";
import { axiosPrivateInstance } from "../../../api";
import { getTeamLeadMembers } from "../../../api/team";
import { useNavigate, useParams } from "react-router-dom";

const ViewTeamLeadMembers = () => {
  const { id } = useParams();
  const navigate= useNavigate();
  const { isLoading, data } = useQuery({
    queryKey: [`viewTeamMembers/${id}`],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(
          `${getTeamLeadMembers}/${id}`
        );
        return response.data;
      }
    },
  });
  console.log(data)
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  console.log(data);
  return (
    <>
      <Paper p={40} withBorder>
        <Flex direction="column" align="center">
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
            {data?.admin?.length > 0 ? (
              <Flex mt={20} gap={40} wrap="wrap" justify="center">
                {data?.admin?.map((item: any, index: any) => (
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
                            //   onClick={() => handleRemovemember(item.id)}
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
                          item?.profile ||
                          "/admin/img/imagenotfound.png"
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
            ) : (
              <Text mt={10} ta="center" size="md" c="red">
                No team lead members for this team is assigned.
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default ViewTeamLeadMembers;
