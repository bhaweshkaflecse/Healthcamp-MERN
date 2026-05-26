import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Pagination,
  Paper,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getclient } from "../../../api/client";
import { useNavigate } from "react-router-dom";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";

const RegisteredClients = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [newRegistration] = useState("true");

  const itemsPerPage = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clientList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getclient, {
        params: {
          page: activePage,
          perPage: itemsPerPage,
          newRegistration: newRegistration,
        },
      });
      return response.data;
    },
  });
  console.log(data);

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
    return <ErrorAxios error={error} fallbackMessage="Error occurred" />;
  }

  const rows = data?.clients.map((element: any, index: any) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1 + (activePage - 1) * itemsPerPage}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Table.Td>
        <Anchor onClick={() => navigate(`/client-info/${element.id}`)}>
          view
        </Anchor>
      </Table.Td>
      <Table.Td>{element?.teamLead?.name}</Table.Td>

      <Table.Td>
        {(() => {
          const packageCountMap = new Map();

          element?.enroll?.forEach((item: any) => {
            const id = item?.package?.id;
            const name = item?.package?.name;

            if (id && name) {
              if (packageCountMap.has(id)) {
                packageCountMap.set(id, {
                  name,
                  count: packageCountMap.get(id).count + 1,
                });
              } else {
                packageCountMap.set(id, { name, count: 1 });
              }
            }
          });

          return Array.from(packageCountMap.values())
            .map(
              (pkg) => `${pkg.name}${pkg.count > 1 ? ` (${pkg.count})` : ""}`
            )
            .join(", ");
        })()}
      </Table.Td>
    </Table.Tr>
  ));

  const totalPages = Math.ceil(data?.total / itemsPerPage);

  return (
    <>
      <Title size="h2" c="#6092FE">
        Clients
      </Title>
        <Button variant="default" onClick={() => navigate("/pending-users")} c="primary.1">
          VIEW KYC APPROVAL STATUS OF CLIENTS
        </Button>
      <Paper mt={10} withBorder p={18}>
        <Group justify="space-between">
          <Title size="h3">Registered Clients ({data?.total || 0})</Title>
        </Group>
        <ScrollArea miw={300}>
          <Table mt={10} verticalSpacing="sm" withRowBorders={false}>
            <Table.Thead>
              <Table.Tr bg="#F3F6F9">
                <Table.Th>S.N.</Table.Th>
                <Table.Th miw={200}>Name of Organization</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th miw={150}> Details</Table.Th>
                <Table.Th miw={150}>TeamLeader</Table.Th>
                <Table.Th miw={150}>Enroll Package </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        <Divider my="lg" />
        <Group justify="space-between">
          <Text>
            showing {activePage * itemsPerPage - itemsPerPage + 1}-
            {Math.min(activePage * itemsPerPage, data?.total)} of {data?.total}{" "}
            results
          </Text>
          <Pagination total={totalPages} onChange={setActivePage} />
        </Group>
      </Paper>
    </>
  );
};

export default RegisteredClients;
