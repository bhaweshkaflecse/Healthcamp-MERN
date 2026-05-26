import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../../api/service";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const PackgaeService = () => {
  const location = useLocation();
  const navigate = useNavigate();
  interface formDataType {
    name: string;
    price: [];
    service: any[];
    description: string;
  }
  const [formData, setFormData] = useState<formDataType>(location.state.data);
  const { isLoading, data, error } = useQuery({
    queryKey: ["serviceList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getServices, {});
      return response.data;
    },
  });
  console.log(data)

  const handleSwitchChange = (item: any) => {
    setFormData((prev) => {
      const isServiceIncluded = prev.service.some((exi) => exi.id === item.id);
      let newServices;
      if (isServiceIncluded) {
        newServices = prev.service.filter((exi) => exi.id !== item.id);
      } else {
        newServices = [...prev.service, item];
      }
      return { ...prev, service: newServices };
    });
  };

  if (error) {
    <Alert variant="light" color="red" title="Error in fetching data">
      {error.message}
    </Alert>;
  }
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
      <Title size="h2" c="primary.0">
        Service Management
      </Title>
      <Paper p={20} withBorder>
        <Group justify="space-between">
          <Title size="h4" c="primary.1">
            SERVICES
          </Title>
          <Text>Turn on the services you want to include in your package</Text>
        </Group>
        {data?.servicesWithCalendarStatus?.map((item: any, index: any) => (
          <Paper key={index} bg="#E5ECFA" shadow="lg" p={20} mt={20}>
            <Flex justify="space-between">
              <Box>
                <Text fw={500}>{item.name}</Text>
                <Text maw={300} size="sm" c="dimmed">
                  {item.description}
                </Text>
              </Box>
              <Switch
                checked={formData.service.some((exi) => item.id === exi.id)}
                onChange={() => handleSwitchChange(item)}
              />
            </Flex>
          </Paper>
        ))}
        <Center mt={30}>
          <Button
            onClick={() => {
              navigate(location.state.path, { state: formData });
            }}
            bg="btncolor.0"
          >
            Confirm Service
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default PackgaeService;
