import {
  Alert,
  Anchor,
  Group,
  Image,
  Paper,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getClientskYC, getKycNumber } from "../../../api/team";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../../api";

const TeamKyc = () => {
  const navigate = useNavigate();
  const [kycstatus, setKycStatus] = useState("approved");

  const [filteredData, setFilteredData] = useState([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["pendingclients"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getClientskYC, {});
      return response.data;
    },
  });
  console.log(data);

  const { data: kycData } = useQuery({
    queryKey: ["teamDashboardData"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getKycNumber, {});
      return response.data;
    },
  });

  useEffect(() => {
    const getFilteredData = () => {
      const fd = data?.clients?.filter(
        (client: any) => client?.kyc?.kycStatus === kycstatus
      );
      return fd;
    };

    const filtered = getFilteredData();
    setFilteredData(filtered);
  }, [kycstatus, data]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return (
      <Alert variant="light" title="Something error occured" color="red">
        {/* @ts-ignore */}
        {error?.response.data?.message}
      </Alert>
    );
  }

  const rows = filteredData?.map((element: any, index: any) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Anchor onClick={() => navigate(`/client-details/${element.id}`)}>
        view
      </Anchor>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between">
        <Title size="h2" c="primary.0">
          KYC Status
        </Title>
      </Group>
      <Paper mt={30} withBorder p={20}>
        <Text fw={600} c="primary.0">
          KYC Approval Status
        </Text>
        <Tabs defaultValue="pending">
          <Tabs.List>
            <Tabs.Tab onClick={() => setKycStatus("approved")} value="approved">
              <Paper withBorder p={10}>
                <Group>
                  <Image src="icon/calandericon.png" />
                  <Text>Approved Clients</Text>
                </Group>
                <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
                  <IoIosPeople size={20} color="green" />
                  <Text c="green">{kycData?.clientApproved}</Text>
                </Group>
              </Paper>
            </Tabs.Tab>
            <Tabs.Tab onClick={() => setKycStatus("pending")} value="pending">
              <Paper withBorder p={10}>
                <Group>
                  <Image src="icon/pending.png" />
                  <Text>Pending Clients</Text>
                </Group>
                <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
                  <IoIosPeople size={20} color="#e2be00" />
                  <Text c="#e2be00">{kycData?.clientPending}</Text>
                </Group>
              </Paper>
            </Tabs.Tab>
            <Tabs.Tab onClick={() => setKycStatus("reject")} value="reject">
              <Paper withBorder p={10}>
                <Group>
                  <Image src="icon/verify.png" />
                  <Text>Denied Clients</Text>
                </Group>
                <Group justify="space-between" mt={20} p={20} bg="whitesmoke">
                  <IoIosPeople size={20} color="red" />
                  <Text c="red">{kycData?.clientDenied}</Text>
                </Group>
              </Paper>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={kycstatus}>
            <Table mt={30}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>S.N.</Table.Th>
                  <Table.Th>Name of Organization</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Details</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default TeamKyc;
