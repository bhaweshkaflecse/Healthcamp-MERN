import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Paper,
  Space,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { CiSearch, CiFilter } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getbyrole } from "../../../../api/team";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../../api";

const TeamLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { close }] = useDisclosure(false);
  const [checkedService, setCheckedService] = useState<CheckedServiceState>({});
  const [formData, setFormData] = useState<formdataType>(location.state);

  interface formdataType {
    name: string;
    description: string;
    teamleader: any;
  }
  interface Service {
    id: string;
    name: string;
    description: string;
    email: string;
  }
  
  interface CheckedServiceState {
    [key: string]:
      | {
          id: string;
          name: string;
        }
      | undefined;
  }

  const { isLoading, data } = useQuery({
    queryKey: ["TeamLeaderList"],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(
          `${getbyrole}?role=team_lead`,
          {}
        );
        return response.data;
      }
    },
  });

  const handleSwitchChange =
    (item: Service) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckedService((prev) => {
        if (event.target.checked) {
          setFormData({
            ...formData,
            teamleader: [item],
          });
          return { [item.id]: { id: item.id, name: item.name } };
        } else {
          const { [item.id]: _, ...rest } = prev;
          return rest;
        }
      });
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
      <Paper withBorder p={10} mt={10}>
        <Group justify="space-between">
          <Title size="h3">Team Leader</Title>
          <Group justify="flex-end">
            <Input
              variant="filled"
              radius={10}
              placeholder="Search by Name or Email"
              leftSection={<CiSearch size={16} />}
            />
            <Button
              variant="default"
              bg="#F1F3F5"
              radius={10}
              leftSection={<CiFilter size={16} />}
            >
              Filter
            </Button>
          </Group>
        </Group>
        <Group mt={40} gap={60}>
          {data?.map((item: Service, index: any) => {
            return (
              <Paper key={index} withBorder>
                <Group p={10} justify="end">
                  <Switch
                    checked={!!checkedService[item.id]}
                    onChange={handleSwitchChange(item)}
                  />
                </Group>
                <Flex
                  w="auto"
                  p={10}
                  align="center"
                  wrap="wrap"
                  direction={"column"}
                >
                  <Image radius={80} w={100} src="/img/teamlead.jpg" />
                  <Text mt={10} fw={650}>
                    {item.name}
                  </Text>
                  <Text>{item.email}</Text>
                </Flex>
              </Paper>
            );
          })}
        </Group>
        <Space h={200} />
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
            <Button variant="default">Cancel</Button>
            <Button color="red">Delete</Button>
          </Group>
        </Modal>
        <Center>
          <Button
            bg="btncolor.0"
            onClick={() => navigate("/create-team", { state: formData })}
          >
            Confirm Leader
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default TeamLeader;
