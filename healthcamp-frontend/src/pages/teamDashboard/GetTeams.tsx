import {

  Button,
  Center,
  Flex,
  Group,
  Image,
  Menu,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import React from "react";

import { FaChevronDown } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

const GetTeams = () => {
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Group mt={20} bg="primary.0" p={10} justify="space-between">
        <Text c="white" fw={500} p={8}>
          TeamA
        </Text>
        <Button
          c="blue"
          leftSection={<AiFillEdit size={16} color="primary.0" />}
          variant="default"
        >
          Edit Team
        </Button>
      </Group>

      <Paper p={40} withBorder>
        <Flex direction="column" align="center" gap={10}>
          <Image mt={20} w={150} radius="50%" src="/img/teamlead.jpg" />
          <Text size="sm" c="dimmed">
            Team Lead
          </Text>
          <Text fw={600}>Aayush</Text>
          <Text size="sm" c="dimmed">
            aayush@gmail.com{" "}
          </Text>
          <Text c="dimmed">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta odit
            quis incidunt placeat enim repellendus, esse ea labore, explicabo
            dignissimos sed delectus ipsa qui distinctio?Lorem ipsum dolor, sit
            amet consectetur adipisicing elit. Deleniti sapiente dolores
            laudantium saepe modi. Natus iusto esse saepe non ab! Mollitia vitae
            doloremque laboriosam fuga?
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
            <Flex mt={50} gap={40}>
              <React.Fragment>
                <Flex direction="column">
                  <Group justify="end">
                    <Flex justify="flex-end" w="100%">
                      <Menu shadow="md" width={150}>
                        <Menu.Target>
                          <Button c="black" bg="none">
                            <BsThreeDotsVertical size={20} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item>change Team</Menu.Item>
                          <Menu.Item
                            // onClick={() => handleOpen(detail.id)}
                            c="red"
                          >
                            Delete Member
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Flex>
                  </Group>
                  <Flex direction="column" align="center">
                    <Image w={100} radius="50%" src="/img/teamlead.jpg" />
                    <Text fw={600}>hello </Text>
                    <Text size="sm" c="primary.0">
                      dear
                    </Text>
                    <Text size="sm" c="dimmed">
                      from ktm
                    </Text>
                  </Flex>
                </Flex>
              </React.Fragment>
            </Flex>
            <Center>
              <Button mt={40} variant="default">
                Back To Teams
              </Button>
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="subteam">
            <Group gap={0} mt={30} justify="space-between">
              <Paper p={20} w="92%" bg="blue">
                <Group justify="space-between">
                  <Text c="white">hello subteam</Text>
                  <FaChevronDown color="white" />
                </Group>
              </Paper>
              <Paper p={14} bg="#D9D9D9">
                <IoIosAddCircle size={30} color="#6092FE" />
              </Paper>
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default GetTeams;
