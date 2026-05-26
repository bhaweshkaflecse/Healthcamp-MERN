import {
  Box,
  Center,
  Group,
  Loader,
  Pagination,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { MdCallMissed, MdCallReceived } from "react-icons/md";
import { getCallCenterDetailsAPI } from "../../api/callcenter";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";

const Home = () => {
  const [activePage, setActivePage] = useState(1);

  const getCallsData = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getCallCenterDetailsAPI}?limit=10&page=${activePage}`,
      {}
    );
    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`getCallsDetails/${activePage}`],
    queryFn: getCallsData,
  });
  if (isLoading) {
    if (isLoading) {
      return (
        <Center h="50vh">
          <Box ta="center">
            <Loader color="blue" />
          </Box>
        </Center>
      );
    }
  }

  const rows = data?.data?.map((element: any, index: number) => (
    <Table.Tr key={element.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Table.Td>
        {element.callType == "incoming" ? (
          <Group>
            <MdCallReceived color="green" />
            {element.callType}
          </Group>
        ) : (
          <Group>
            <MdCallMissed color="red" />
            {element.callType}
          </Group>
        )}
      </Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString("en-CA")}</Table.Td>
      <Table.Td>{element?.description}</Table.Td>
      <Table.Td>{element?.reason}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Title size="h2" c="primary.0">
        Call Log
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Text fw={600}>Call History</Text>
        <ScrollArea>
          <Table mt={20}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>S.N.</Table.Th>
                <Table.Th>Name of Organization</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Call Type</Table.Th>
                <Table.Th>Date and Time</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Reason</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>

        <Paper withBorder p={8} mt="md">
          <Group justify="space-between">
            <Text>Showing 1-10 of {data?.data?.length} results</Text>
            <Pagination total={data?.page_total} onChange={setActivePage} />
          </Group>
        </Paper>
      </Paper>
    </>
  );
};

export default Home;
