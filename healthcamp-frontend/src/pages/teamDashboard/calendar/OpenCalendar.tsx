import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClientEnrollmentByPackage } from "../../../api/calender";
import { axiosPrivateInstance } from "../../../api";
import { getAdminInfo } from "../../../api/role";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

const OpenCalendar = () => {
  const location = useLocation();
  const packageid = location.state.id;
  const serviceName = location.state.name;
  console.log(serviceName);
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 300); // debounce 300ms

  const accessTokenn = async () => {
    try {
      const resp = await axiosPrivateInstance.get(`${getAdminInfo}`, {});
      return resp.data;
    } catch (error) {
      console.error("Error sending request", error);
      throw error;
    }
  };

  const { data: adminData } = useQuery({
    queryKey: ["AdminData"],
    queryFn: accessTokenn,
  });
  const admin_id = adminData?.id;

  const { isLoading, data, error } = useQuery({
    queryKey: [`enrollmentByPackages`, packageid],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${ClientEnrollmentByPackage}/${packageid}?teamLeadId=${admin_id}`
      );
      return response.data;
    },
  });
  console.log(data);

  const filteredClients = data?.enrolls?.filter((item: any) => {
    const name = item.client.name.toLowerCase();
    const email = item.client.email.toLowerCase();
    const query = debounced.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  if (isLoading) {
    <div>loading...</div>;
  }
  if (error) {
    <div>error is due to {error.message}</div>;
  }

  return (
    <>
      <Title size="h2" c="primary.0">
        Calendar
      </Title>
      <Paper p={20} mt={10} withBorder>
        <Title size="h3" c="primary.1">
          Calendar for {serviceName} Service
        </Title>
        <Flex gap={0} align="center">
         
          <Text>
            You can now send calendars to clients who have enrolled in this
            service. Below is a list of these clients. By clicking on them, you
            can send the calendar directly to each individual. This feature
            streamlines the process of sharing calendars with enrolled clients.
          </Text>
        </Flex>

        <Paper withBorder mt={20} p={20}>
          <Group justify="space-between">
            <Text c="primary.0" fw={600}>
              List of Clients Enrolled in this Service
            </Text>
            <TextInput
              placeholder="Search client by name "
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              mb={20}
            />
          </Group>
          {filteredClients?.map((item: any, index: any) => {
            return (
              <Paper key={index} withBorder mt={20} p={20}>
                <Flex justify="space-between" align="center">
                  <Group>
                    <Image w={50} radius="50%" src={item?.client.profile} />
                    <Box>
                     
                      <Text fw={500}>{item?.client.name}</Text>
                      <Text size="sm" c="dimmed">
                        {item?.client.email}
                      </Text>
                      <Text size="sm" c="blue">
                        {item?.createdAt.slice(0, 10)}
                      </Text>
                    </Box>
                  </Group>

                  <Button
                    onClick={() =>
                      navigate(`/setCalendar/${item.client.id}`, {
                        state: {
                          serviceId: id,
                          enrollId: item.id,
                          serviceName: serviceName,
                          profile: item?.client?.profile,
                        },
                      })
                    }
                    rightSection={<FaCalendarAlt />}
                    bg="btncolor.1"
                  >
                    Set Calendar
                  </Button>
                </Flex>
              </Paper>
            );
          })}
        </Paper>
      </Paper>
    </>
  );
};

export default OpenCalendar;
