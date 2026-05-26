import {
  Anchor,
  Box,
  // Button,
  Center,
  Divider,
  Group,
  Loader,
  // Modal,
  Pagination,
  Paper,
  ScrollArea,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { Table } from "@mantine/core";
// import { MdDelete } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getkycstatus } from "../../../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";
// import { useDisclosure } from "@mantine/hooks";

interface kycStatusTye {
  [key: string]: string;
}
interface KycApprovalPanelProps {
  // title:"",
  data: any[];
  setKycStatus: (status: string) => void;
  kycStatus: string;
}
const KycApprovalPanel = ({
  data,
  setKycStatus,
  kycStatus,
}: KycApprovalPanelProps) => {
  const navigate = useNavigate();
  // const [opened, { open, close }] = useDisclosure(false);
  // const [selectedUser, setSelectedUser] = useState<any>(null); // Track selected user

  // const handleDeleteClick = (user: any) => {
  //   setSelectedUser(user);
  //   open();
  // };

  const rows = data?.map((element: any, index: any) => (
    <Table.Tr key={element.name}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Table.Td>
        <Anchor onClick={() => navigate(`/client/${element.id}`)}>View</Anchor>
      </Table.Td>
      {kycStatus === "approved" && (
        <Table.Td>
          {/* <MdDelete
            size={20}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteClick(element)}
          /> */}
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <>
      <Title size="h2" c="#6092FE">
        KYC Approval
      </Title>

      {/* Tabs */}
      <Group mt={10}>
        <Tabs.List>
          <Tabs.Tab onClick={() => setKycStatus("pending")} value="gallery">
            <Title fw={500} size="h4">
              Pending Users
            </Title>
          </Tabs.Tab>
          <Tabs.Tab onClick={() => setKycStatus("approved")} value="messages">
            <Title fw={500} size="h4">
              Approved Users
            </Title>
          </Tabs.Tab>
          <Tabs.Tab onClick={() => setKycStatus("reject")} value="settings">
            <Title fw={500} size="h4">
              Denied Users
            </Title>
          </Tabs.Tab>
        </Tabs.List>
      </Group>

      {/* Table */}
      <Paper mt={20} withBorder p={18}>
        <Group justify="space-between">
          <Title size="h3">Clients</Title>
        </Group>
        <ScrollArea>
          <Table mt={10} verticalSpacing="sm" withRowBorders={false}>
            <Table.Thead>
              <Table.Tr bg="#F3F6F9">
                <Table.Th>S.N.</Table.Th>
                <Table.Th miw={200}>Name of Organization</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Details</Table.Th>
                {/* {kycStatus === "approved" && <Table.Th>Action</Table.Th>} */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        <Divider my="lg" />
        <Group justify="space-between">
          <Text>showing 1-5 of 22 results</Text>
          <Pagination total={3} />
        </Group>
      </Paper>

      {/* Modal should be here inside return */}
      {/* <Modal opened={opened} onClose={close} centered>
        <Title order={3} mb="md">
          Delete User
        </Title>
        <Text>
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
        </Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            color="red"
            style={{ color: "white" }}
            onClick={() => {
              // TODO: call delete API here
              console.log("Delete", selectedUser?.id);
              close();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal> */}
    </>
  );
};

const PendingUser = () => {
  const kycStatus: kycStatusTye = {
    pending: "pending",
    approved: "approved",
    reject: "reject",
  };
  const [kycsStatus, setKycStatus] = useState(kycStatus.pending);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getkycstatus}?status=${kycsStatus}`,
        {}
      );
      return response.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [kycStatus, refetch]);
  if (error) {
    return <ErrorAxios error={error} fallbackMessage="Error Occurred" />;
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
      <Tabs radius="lg" defaultValue="gallery">
        <Tabs.Panel value="gallery">
          <KycApprovalPanel
            // title="Pending Users"
            data={data}
            setKycStatus={setKycStatus}
            kycStatus={kycStatus.pending}
          />
        </Tabs.Panel>
        <Tabs.Panel value="messages">
          <KycApprovalPanel
            // title="Approved Users"
            data={data}
            setKycStatus={setKycStatus}
            kycStatus={kycStatus.approved}
          />
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <KycApprovalPanel
            // title="Denied Users"
            data={data}
            setKycStatus={setKycStatus}
            kycStatus={kycStatus.reject}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default PendingUser;
