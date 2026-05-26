import { Box, Flex, Select, Table, Text, Title } from "@mantine/core";
import { axiosPrivateInstance } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { getLeadClientsAPI } from "../../api/sales";

const LeadsList = () => {
  const getLeadClients = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getLeadClientsAPI}?reason=lead`
    );
    return resp?.data;
  };

  const { data } = useQuery({
    queryKey: ["get-lead-clients"],
    queryFn: getLeadClients,
  });

  console.log("my data", data);

  const rows = (
    <>
      {data?.data?.map((lead: any) => (
        <>
          <Table.Tr>
            <Table.Td>{lead?.name}</Table.Td>
            <Table.Td>Aayush Company</Table.Td>
            <Table.Td>Website Inquiry</Table.Td>
            <Table.Td>{lead?.contact}</Table.Td>
            <Table.Td>aayushpoudel59@gmail.com</Table.Td>
            <Table.Td>Interested</Table.Td>
          </Table.Tr>
        </>
      ))}
    </>
  );

  return (
    <Box>
      <Title size="xl">Welcome to Lead Management!</Title>

      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs" mt="xl">
          <Text size="md" fw="bold">
            Track and Manage Your Leads
          </Text>
          <Text>
            Follow up with potential clients and convert leads into customers.
          </Text>
        </Flex>
      </Flex>

      <Flex justify="end">
        <Select
          placeholder="Filter by Status"
          data={["Interested", "Follow-up", "Converted", "Lost"]}
        />
      </Flex>

      <Table mt={20} stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr bg="whitesmoke">
            <Table.Th>Name</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Lead Source</Table.Th>
            <Table.Th>Contact Number</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};

export default LeadsList;
