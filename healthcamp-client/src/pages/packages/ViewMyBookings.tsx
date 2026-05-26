import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Menu,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { CiFilter } from "react-icons/ci";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getBookingsAPI } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ViewMyBookings = () => {
  const { id } = useParams();
  const {enrollId} = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("booked");
  const location = useLocation();


  const getBookings = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getBookingsAPI}/${enrollId}?status=${status}&serviceID=${id}`
    );
    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`bookingDetails/${id}`, status],
    queryFn: getBookings,
    gcTime: 0,
    staleTime: 0
  });
  function Select() {
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="default" leftSection={<CiFilter />}>
            {status}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item value={"A"} onClick={() => setStatus("hold")}>
            Hold
          </Menu.Item>

          <Menu.Item value={"B"} onClick={() => setStatus("booked")}>
            Booked
          </Menu.Item>

          <Menu.Item value={status} onClick={() => setStatus("cancel")}>
            Cancel
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  const datee = data?.[0]?.bookingDates;

  function Table1() {
    const rows = data?.map((element: any) => (
      <Table.Tr key={element?.id}>
        <Table.Td>{element?.id}</Table.Td>

        <Table.Td>
          {datee.map((da: any) => (
            <Text>{da?.date}</Text>
          ))}
        </Table.Td>
        <Table.Td>{element?.status}</Table.Td>
      </Table.Tr>
    ));

    if (data?.length == 0) {
      return (
        <Text c="red" ta="center" p={40}>
          No data found
        </Text>
      );
    }
    return (
      <Table>
        <>
          <Table.Thead bg="blue" c="white" my={4}>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Booked Date</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </>
      </Table>
    );
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
    <Box>
      <Group my="sm" justify="space-between">
        <Title c="blue">Booked Packages</Title>
        <Flex justify="end" align="center" gap="md">
          <Select />

          <Button
            onClick={() =>
              navigate(`/book-event/${id}`, {
                state: {
                  enrollPackageId: location.state?.enrollPackageId,
                  serviceId: id,
                  enrollId:enrollId
                },
              })
            }
            bg="green"
            p={4}
          >
            Book the Calendar
          </Button>
        </Flex>
      </Group>

      <Paper withBorder>
        <Table1 />
      </Paper>
    </Box>
  );
};

export default ViewMyBookings;
