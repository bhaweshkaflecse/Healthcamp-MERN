import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { LuForward } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";
import {
 
  postForwardReportmachis,
  reportParticipant,
} from "../../api/enrollment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Participant {
  id: string;
  name: string;
  gender: string;
  grade: string;
  contact: string;
  email: string;
  reportForwardStatus: string;
}

const ViewReport = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const bookingId = location.state;

  const [selectAllState, setSelectAllState] = useState(false);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<Participant[] | null>(null);

  const getEnrollParticipantsReport = async () => {
    const resp = await axiosPrivateInstance.get(
      `${reportParticipant}/${bookingId}`
    );
    return resp.data;
  };

  const { data: ParticipantsData } = useQuery({
    queryKey: ["get-participants"],
    queryFn: getEnrollParticipantsReport,
  });


  const participantList: Participant[] = useMemo(() => {
    return (
      ParticipantsData?.map((item: any) => ({
        id: item.id,
        name: item.name,
        gender: item.gender,
        grade: item.grade,
        contact: item.contact,
        email: item.email,
        reportForwardStatus: item.reportForwardStatus,
      })) || []
    );
  }, [ParticipantsData]);
  

  const displayList = filteredData || participantList;

  const selectedParticipants = Object.entries(checkedState)
    .filter(([_, checked]) => checked)
    .map(([id]) => id);

  const forwardParticipants = async () => {
    if (selectedParticipants.length === 0) return;

    const resp = await axiosPrivateInstance.patch(
      `${postForwardReportmachis}/${bookingId}`,
      { participantIds: selectedParticipants }
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["forward-participants"],
    mutationFn: forwardParticipants,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-participants"],
        exact: true,
      });
      toast.success("Reports forwarded successfully!");
      setCheckedState({});
      setSelectAllState(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    },
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const participant = participantList.find((p) => p.id === id);
    if (participant?.reportForwardStatus === "true") return;

    const newState = { ...checkedState, [id]: checked };
    setCheckedState(newState);

    const allSelectable = displayList.filter(
      (p) => p.reportForwardStatus !== "true"
    );

    const allSelected = allSelectable.every((p) => newState[p.id]);
    setSelectAllState(allSelected);
  };

  const handleSelectAll = () => {
    const newCheckedState: Record<string, boolean> = {};
    const toggleState = !selectAllState;

    displayList.forEach((p) => {
      if (p.reportForwardStatus !== "true") {
        newCheckedState[p.id] = toggleState;
      }
    });

    setCheckedState(toggleState ? newCheckedState : {});
    setSelectAllState(toggleState);
  };

  const handleStatusFilter = (status: string | null) => {
    if (!status) return setFilteredData(null);

    const filtered = participantList.filter(
      (p) =>
        (status === "Forwarded" && p.reportForwardStatus === "true") ||
        (status === "Not Forwarded" && p.reportForwardStatus !== "true")
    );
    setFilteredData(filtered);
  };

  return (
    <Box>
      <Title size={22} fw="bold" c="blue">
        Report Analysis
      </Title>

      <Flex justify="space-between" mt="md">
        <Flex align="center" gap="xs">
          <IoPeopleSharp />
          <Box>
            <Text size="sm">Total Participants</Text>
            <Text fw="bold">{participantList.length}</Text>
          </Box>
        </Flex>

        <Button
          loading={isPending}
          onClick={() => mutate()}
          leftSection={<LuForward />}
          bg="green"
          disabled={selectedParticipants.length === 0}
        >
          {selectedParticipants.length > 0
            ? `Forward Reports (${selectedParticipants.length})`
            : "Forward Reports"}
        </Button>
      </Flex>

      <Flex my="md" align="center" justify="space-between">
        <Button onClick={handleSelectAll} c="black" size="xs" bg="#89CFF0">
          {selectAllState ? "Unselect All" : "Select All"}
        </Button>

        <Select
          onChange={handleStatusFilter}
          placeholder="Status"
          data={["Forwarded", "Not Forwarded"]}
        />
      </Flex>

      <Table mt={10} stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr bg="whitesmoke">
            <Table.Th>Participant ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Gender</Table.Th>
            <Table.Th>Class</Table.Th>
            <Table.Th>Contact</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Report</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayList.map((p) => (
            <Table.Tr key={p.id}>
              <Table.Td>
                <Flex gap="xs" align="center">
                  <Checkbox
                    disabled={p.reportForwardStatus === "true"}
                    checked={!!checkedState[p.id]}
                    onChange={(e) =>
                      handleCheckboxChange(p.id, e.currentTarget.checked)
                    }
                  />
                  {p.id}
                </Flex>
              </Table.Td>
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.gender}</Table.Td>
              <Table.Td>{p.grade}</Table.Td>
              <Table.Td>+977 {p.contact || "-"}</Table.Td>
              <Table.Td>{p.email || "-"}</Table.Td>
              <Table.Td>
                <Button size="xs" variant="outline">
                  View Report
                </Button>
              </Table.Td>
              <Table.Td>
                {p.reportForwardStatus === "true" ? (
                  <Badge color="green">Forwarded</Badge>
                ) : (
                  <Badge color="red">Not Forwarded</Badge>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default ViewReport;
