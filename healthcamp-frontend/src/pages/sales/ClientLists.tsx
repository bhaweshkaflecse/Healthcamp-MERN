import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ClientsList = () => {
  const [openedIssues, { close: closeIssue }] = useDisclosure(false);

  const [, { close: closeDeleteIssue }] = useDisclosure(false);

  const rows = (
    <>
      <Table.Tr>
        <Table.Td>Aayush Poudel</Table.Td>

        <Modal opened={openedIssues} onClose={closeIssue}>
          <Box>
            <Text fw="bold">Title of the Issue</Text>

            <Text>
              Issue description Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Cupiditate exercitationem dignissimos sit.
            </Text>

            <Text my="sm" fw="bold">
              Images
            </Text>

            {/* 
  const getAllClients = async () => {
    const resp = await axiosPrivateInstance.get(`${getAllClientsAPI}?page=1&perPage=10`);

    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["get-all-clients"],
    queryFn: getAllClients,
  });

  console.log("data", data); */}

            <Group mt="xl">
              <Button color="red">Confirm</Button>
              <Button onClick={closeDeleteIssue}>No</Button>
            </Group>
          </Box>
        </Modal>

        <Table.Td>Bardiya</Table.Td>
        <Table.Td>Lumbini</Table.Td>

        <Table.Td>+977 9843249388</Table.Td>

        <Table.Td>aayushpoudel59@gmail.com</Table.Td>
      </Table.Tr>
    </>
  );
  return (
    <Box>
      <Title size="xl">Welcome to Sales Support!</Title>

      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs" mt="xl">
          <Text size="md" fw="bold">
            Manage Your Clients and Sales Records
          </Text>
          <Text>Track client details, sales status, and follow-ups.</Text>
        </Flex>
      </Flex>

      <Flex justify="end">
        <Select placeholder="Status" data={["Ticket Open", "Ticket Close"]} />
      </Flex>

      <Table mt={20} stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr bg="whitesmoke">
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Province</Table.Th>
            {/* <Table.Th>Gender</Table.Th> */}
            <Table.Th>Contact Number</Table.Th>
            {/* <Table.Th>Contact</Table.Th> */}
            {/* <Table.Th>Email</Table.Th> */}
            {/* <Table.Th c="blue">Report</Table.Th> */}
            <Table.Th>Email</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};

export default ClientsList;
