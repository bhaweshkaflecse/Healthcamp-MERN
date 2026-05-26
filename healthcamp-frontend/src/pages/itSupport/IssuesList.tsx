import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Switch,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaEye } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { deleteTicketListAPI, getAllTicketsAPI, getTicketByIdAPI, updateIndividualTicketAPI } from "../../api/itTeam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const IssuesList = () => {
  const [openedIssues, { open: openIssue, close: closeIssue }] = useDisclosure(false);
  const [deleteIssues, { open: openDeleteIssue, close: closeDeleteIssue }] = useDisclosure(false);
  const [openedStatus, { open: openStatus, close: closeStatus }] = useDisclosure(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [issueId, setIssueId] = useState<string | null>(null);
  const [statusIssueId, setStatusIssueId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<boolean>(false);
  console.log('new status', newStatus)

  const getIndividualIssueDetail = async () => {
    if (!issueId) return;
    const resp = await axiosPrivateInstance.get(`${getTicketByIdAPI}/${issueId}`);
    return resp.data;
  };

  const onUpdateStatus = async () => {
    if (!statusIssueId) return;
    const resp = await axiosPrivateInstance.patch(`${updateIndividualTicketAPI}/${statusIssueId}`, {
      isOpen: newStatus,
    });
    return resp.data;
  };

  const { mutate: updateStatus } = useMutation({
    mutationKey: ["on-update"],
    mutationFn: onUpdateStatus,
    onSuccess: () => {
      toast.success("Status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-all-tickets"], exact: true });
      closeStatus();
    },
  });

  const deleteIssueList = async () => {
    if (!issueId) return;
    const resp = await axiosPrivateInstance.delete(`${deleteTicketListAPI}/${issueId}`);
    return resp.data;
  };

  const { mutate: deleteTicket, isPending: isDeleteLoading } = useMutation({
    mutationKey: ["delete-list"],
    mutationFn: deleteIssueList,
    onSuccess: () => {
      toast.success("Ticket has been deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-all-tickets"], exact: true });
      closeDeleteIssue();
    },
  });

  const openStatusModal = (issueId: string, currentStatus: boolean) => {
    setStatusIssueId(issueId);
    setNewStatus(!currentStatus);
    openStatus();
  };

  const { data } = useQuery({ queryKey: ["get-all-tickets"], queryFn: async () => {
    const resp = await axiosPrivateInstance.get(getAllTicketsAPI);
    return resp.data;
  }});
  console.log("data", data);
  const { data: individualData } = useQuery({
    queryKey: ["get-individual-details", issueId],
    queryFn: getIndividualIssueDetail,
  });

  const openIndividualIssue = (issueId: string) => {
    setIssueId(issueId);
    openIssue();
  };

  return (
    <Box>
      <Title size="xl">Welcome to IT Support!</Title>

      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs" mt="xl">
          <Text size="md" fw="bold">Issues that the registered clients have faced</Text>
          <Text>Solve the issues that the customer are facing</Text>
        </Flex>

        <IoIosAdd onClick={() => navigate("/ticket-form")} style={{ background: "#6092fd", borderRadius: "16px", color: "white", cursor: "pointer" }} size={40} />
      </Flex>

      <Table mt={20} stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr bg="whitesmoke">
            <Table.Th>Issue</Table.Th>
            <Table.Th>Issue Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Action</Table.Th>
            <Table.Th>View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.tickets?.map((issue: any) => (
            <Table.Tr key={issue.id}>
              <Table.Td>{issue.title}</Table.Td>
              <Table.Td>{new Date(issue.createdAt).toLocaleString()}</Table.Td>

              <Table.Td>
                <Switch checked={issue.isOpen} onChange={() => openStatusModal(issue.id, issue.isOpen)} />
              </Table.Td>
              <Table.Td>
                <Group>
                  <MdDelete onClick={() => { setIssueId(issue.id); openDeleteIssue(); }} color="red" style={{ cursor: "pointer" }} />
                  <MdEdit onClick={() => navigate("/edit-issue", { state: issue.id })} style={{ cursor: "pointer" }} />
                </Group>
              </Table.Td>
              <Table.Td>
                <FaEye onClick={() => openIndividualIssue(issue.id)} style={{ cursor: "pointer" }} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={openedStatus} onClose={closeStatus}  centered>
        <Text>Are you sure you want to change the status?</Text>
        <Group mt="xl">
          <Button bg="green" onClick={() => updateStatus()}>Yes</Button>
          <Button bg="red" onClick={closeStatus}>No</Button>
        </Group>
      </Modal>

      <Modal opened={openedIssues} onClose={closeIssue}>
          <Box>
            <Text ta="center" fw="bold">
              {individualData?.title}
            </Text>

            <Text ta="center">{individualData?.description}</Text>

            <Text my="sm" fw="bold">
              Images
            </Text>

            <Group justify="center" gap="md">
              {individualData?.images?.map((img: any) => (
                <Image w={100} src={img?.url} />
              ))}
            </Group>
          </Box>
        </Modal>


      <Modal opened={deleteIssues} onClose={closeDeleteIssue}>
        <Text fw="bold">Do you want to delete this issue?</Text>
        <Group mt="xl">
          <Button loading={isDeleteLoading} onClick={() => deleteTicket()} color="red">Confirm</Button>
          <Button onClick={closeDeleteIssue}>No</Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default IssuesList;