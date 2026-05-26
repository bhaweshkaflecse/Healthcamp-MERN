import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { AiFillEdit } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  delService,
  getServices,
  serviceBySubteam,
} from "../../../api/service";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";

const Services = () => {
  const [, setServices] = useState();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // interface Service {
  //   id: number;
  //   name: string;
  //   description: string;
  // }

  const { isLoading, data, error } = useQuery({
    queryKey: ["serviceList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getServices);
      return response.data;
    },
  });

  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleDescription = (id: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const [hasSubteam, setHasSubteam] = useState<boolean>(false);

  const { data: serviceWithSubTeam } = useQuery({
    queryKey: [`serviceWithSubTeam`, hasSubteam],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${serviceBySubteam}?type=${hasSubteam}`
      );
      return response.data;
    },
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data]);

  const deleteService = useMutation({
    mutationFn: async () => {
      await axiosPrivateInstance.delete(`${delService}/${deleteId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceList"] });
      toast.error("Service deleted successfully!");
      close();
    },
    onError: (error) => {
      toast.error(`Error deleting service: ${error.message}`);
    },
  });

  const handleOpen = (id: number) => {
    open();
    setDeleteId(id);
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
  if (error) {
    return (
      <ErrorAxios error={error} fallbackMessage="Failed to load services" />
    );
  }

  return (
    <>
      <Title size="h2" c="primary.0">
        Service Management
      </Title>
      <Paper p={20} mt={10} withBorder>
        <Group justify="space-between">
          <Title c="primary.1" size="h4">
            SERVICES
          </Title>

          <Button
            onClick={() => navigate("/createservices")}
            leftSection={<IoMdAdd size={16} />}
            bg="primary.1"
          >
            Create New Service
          </Button>
        </Group>
        <Tabs
          mt={30}
          color="white"
          variant="pills"
          radius="xl"
          defaultValue="all"
        >
          <Tabs.List style={{ borderRadius: "50px" }} p={5} bg="background.0">
            <Tabs.Tab c="black" value="all">
              All
            </Tabs.Tab>
            <Tabs.Tab
              c="black"
              value="unasigned"
              onClick={() => setHasSubteam(false)} // Ensure false for unassigned services
            >
              Service without assigned members
            </Tabs.Tab>

            <Tabs.Tab
              c="black"
              value="asigned"
              onClick={() => setHasSubteam(true)} // Ensure true for assigned services
            >
              Service with assigned members
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel mt={30} value="all">
            <Modal opened={opened} onClose={close}>
              <Center>
                <CgDanger size={25} color="red" />
              </Center>
              <Text mt={10} fw={600} ta="center">
                Are you sure you want to delete?
              </Text>
              <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
                The action of deletion cannot be undone. Are you sure you want
                to proceed deleting this service?
              </Text>
              <Group mt={20} justify="center">
                <Button variant="default" onClick={close}>
                  Cancel
                </Button>
                <Button
                  loading={deleteService.isPending}
                  onClick={() => deleteService.mutate()}
                  color="red"
                >
                  Delete
                </Button>
              </Group>
            </Modal>
            {data?.servicesWithCalendarStatus?.map((service: any) => (
              <Paper
                key={service.id}
                mt={20}
                shadow="md"
                radius={10}
                p={20}
                bg="background.0"
              >
                <Group justify="space-between">
                  <Text fw={500}>{service.name}</Text>
                  <Group>
                    <MdDelete
                      onClick={() => handleOpen(service.id)}
                      color="red"
                      size={25}
                    />
                    <AiFillEdit
                      onClick={() =>
                        navigate("/editservice", { state: service })
                      }
                      color="green"
                      size={25}
                    />
                  </Group>
                </Group>
                <>
                  <Text fw={400} c="#878787" size="sm" maw={500} mt={10}>
                    {expandedDescriptions[service.id]
                      ? service.description
                      : `${service.description.slice(0, 100)}${
                          service.description.length > 100 ? "..." : ""
                        }`}

                    {service.description.length > 100 && (
                      <Button
                        variant="subtle"
                        size="xs"
                        color="black"
                        onClick={() => toggleDescription(service.id)}
                        px={4}
                        style={{
                          display: "inline",
                          fontSize: "0.85rem",
                          verticalAlign: "baseline",
                        }}
                      >
                        {expandedDescriptions[service.id]
                          ? " See less"
                          : " See more"}
                      </Button>
                    )}
                  </Text>
                </>
                <Button
                  onClick={() =>
                    navigate(`/service/${service.id}`, { state: service })
                  }
                  radius={10}
                  rightSection={<IoIosArrowDroprightCircle size={20} />}
                  mt={10}
                  bg="btncolor.0"
                >
                  View Events
                </Button>
              </Paper>
            ))}
          </Tabs.Panel>

          <Tabs.Panel mt={30} value="unasigned">
            <>
              {serviceWithSubTeam?.map((item1: any) => (
                <Paper
                  key={item1.id}
                  mt={20}
                  shadow="md"
                  radius={10}
                  p={20}
                  bg="background.0"
                >
                  <Group justify="space-between">
                    <Text fw={500}>{item1.name}</Text>
                    <Group>
                      <MdDelete
                        onClick={() => handleOpen(item1.id)}
                        color="red"
                        size={25}
                      />
                      <AiFillEdit
                        onClick={() =>
                          navigate("/editservice", { state: item1 })
                        }
                        color="green"
                        size={25}
                      />
                    </Group>
                  </Group>
                  {/* <Text fw={400} c="#878787" size="sm" maw={300} mt={10}>
                    {item1.description}
                  </Text> */}
                  <Text fw={400} c="#878787" size="sm" maw={500} mt={10}>
                    {expandedDescriptions[item1.id]
                      ? item1.description
                      : `${item1.description.slice(0, 100)}${
                          item1.description.length > 100 ? "..." : ""
                        }`}

                    {item1.description.length > 100 && (
                      <Button
                        variant="subtle"
                        size="xs"
                        color="black"
                        onClick={() => toggleDescription(item1.id)}
                        px={4}
                        style={{
                          display: "inline",
                          fontSize: "0.85rem",
                          verticalAlign: "baseline",
                        }}
                      >
                        {expandedDescriptions[item1.id]
                          ? " See less"
                          : " See more"}
                      </Button>
                    )}
                  </Text>
                  <Button
                    onClick={() =>
                      navigate(`/service/${item1.id}`, { state: item1 })
                    }
                    radius={10}
                    rightSection={<IoIosArrowDroprightCircle size={20} />}
                    mt={10}
                    bg="btncolor.0"
                  >
                    View Events
                  </Button>
                </Paper>
              ))}
            </>
          </Tabs.Panel>

          <Tabs.Panel mt={30} value="asigned">
            <>
              {serviceWithSubTeam?.map((item: any) => (
                <Paper
                  key={item.id}
                  mt={20}
                  shadow="md"
                  radius={10}
                  p={20}
                  bg="background.0"
                >
                  <Group justify="space-between">
                    <Text fw={500}>{item?.name}</Text>

                    <Badge color="gray" variant="filled">
                      Subteam :{/* Assigned to : {""}  */}
                      <span style={{ color: "white" }}>
                        {item?.subTeam?.map((subteam: any) => subteam?.name)}
                      </span>
                    </Badge>
                  </Group>
                  <Text fw={400} c="#878787" size="sm" maw={500} mt={10}>
                    {expandedDescriptions[item.id]
                      ? item.description
                      : `${item.description.slice(0, 100)}${
                          item.description.length > 100 ? "..." : ""
                        }`}

                    {item.description.length > 100 && (
                      <Button
                        variant="subtle"
                        size="xs"
                        color="black"
                        onClick={() => toggleDescription(item.id)}
                        px={4}
                        style={{
                          display: "inline",
                          fontSize: "0.85rem",
                          verticalAlign: "baseline",
                        }}
                      >
                        {expandedDescriptions[item.id]
                          ? " See less"
                          : " See more"}
                      </Button>
                    )}
                  </Text>
                  <Button
                    onClick={() =>
                      navigate(`/service/${item.id}`, { state: item })
                    }
                    radius={10}
                    rightSection={<IoIosArrowDroprightCircle size={20} />}
                    mt={10}
                    bg="btncolor.0"
                  >
                    View Events
                  </Button>
                </Paper>
              ))}
            </>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default Services;
