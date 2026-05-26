import {
  Anchor,
  Button,
  Divider,
  Group,
  Input,
  Pagination,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { CiFilter, CiSearch } from "react-icons/ci";
import { Table } from "@mantine/core";
// import { MdDelete } from "react-icons/md"
import { denieddata } from "../rough/Rough";

const DeniedUser = () => {
  const rows = denieddata.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.sn}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Table.Td>
        <Anchor>{element.participant}</Anchor>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title c="blue.5">KYC Approval</Title>
      <Group mt={10}>
        <Title size="h4">Pending Users</Title>
        <Title size="h4">Approved Users</Title>
        <Title size="h4">Denied Users</Title>
      </Group>
      <Divider mt={10} />

      <Paper mt={20} withBorder p={18}>
        <Group justify="space-between">
          <Title size="h2">Clients</Title>
          <Group justify="flex-end">
            <Input
              radius={10}
              placeholder="Search by Name or Email"
              leftSection={<CiSearch size={16} />}
            />
            <Button
              variant="default"
              radius={10}
              leftSection={<CiFilter size={16} />}
            >
              Filter
            </Button>
          </Group>
        </Group>
        <ScrollArea>
          <Table mt={10} verticalSpacing="sm" withRowBorders={false}>
            <Table.Thead>
              <Table.Tr bg="#F3F6F9">
                <Table.Th>S.N.</Table.Th>
                <Table.Th miw={200}>Name of Organization</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th miw={150}>Participants Details</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        <Divider my="lg" />
        <Group justify="space-between">
          <Text> showing 1-5 of 22 results</Text>
          <Pagination total={3} />
        </Group>
      </Paper>
    </>
  );
};

export default DeniedUser;
