import {
  Button,
  Flex,
  Group,
  Input,
  Modal,
  Paper,
  Table,
  Text,
  Title,
  Select,
} from "@mantine/core";
import { useState } from "react";
import { CiEdit, CiFilter, CiSearch } from "react-icons/ci";
import { axiosPrivateInstance } from "../../api";
import { deleteParticipant, getParticipants } from "../../api/participants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Participant {
  participantId: string;
  name: string;
  gender: string;
  grade: string;
  contact: string;
  email: string;
  id: string;
}

const EditParticipants = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const getPartici = async (): Promise<Participant[]> => {
    const resp = await axiosPrivateInstance.get(getParticipants);
    return resp.data;
  };

  const participantDelete = async (id: string) => {
    const resp = await axiosPrivateInstance.delete(
      `${deleteParticipant}/${id}`
    );
    return resp.data;
  };

  const { data, isLoading } = useQuery<Participant[]>({
    queryKey: ["registeredUsers"],
    queryFn: getPartici,
  });

  const { mutate, error, isPending } = useMutation({
    mutationKey: ["participantInfo"],
    mutationFn: participantDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registeredUsers"] });
      setModalUserId(null);
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading data...</Text>;

  const handleDelete = (id: string) => {
    mutate(id);
  };

  const handleEdit = (id: string) => {
    navigate("/edit", {
      state: { id },
    });
  };

  // Extract unique values for grade and gender
  const availableGrades = Array.from(new Set(data?.map((p) => p.grade)));
  const availableGenders = Array.from(new Set(data?.map((p) => p.gender)));

  const filteredData = data?.filter((participant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      participant.name.toLowerCase().includes(searchLower) ||
      participant.id.toLowerCase().includes(searchLower);
    const matchesClass =
      classFilter === "" || String(participant.grade) === classFilter;
    const matchesGender =
      genderFilter === "" || String(participant.gender) === genderFilter;

    return matchesSearch && matchesClass && matchesGender;
  });

  const rows = filteredData?.map((element: Participant) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.gender}</Table.Td>
      <Table.Td>{String(element.grade)}</Table.Td>
      <Table.Td>{element.contact}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>
        <Group>
          <CiEdit onClick={() => handleEdit(element.id)} />
          <MdDelete color="red" onClick={() => setModalUserId(element.id)} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title c="primary.2" size="h4">
        Participants Details
      </Title>
      <Paper withBorder p={20} mt={10}>
        <Group mt={20} justify="space-between">
          <Text fw={550}>Participants</Text>
          <Group>
            <Input
              leftSection={<CiSearch />}
              placeholder="Search by Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
            <Select
              leftSection={<CiFilter />}
              placeholder="Filter by Class"
              data={
                availableGrades.length > 0
                  ? availableGrades.map((grade) => ({
                      value: String(grade), 
                      label: `Class ${grade}`,
                    }))
                  : []
              }
              value={classFilter}
              onChange={(val) => setClassFilter(val || "")}
              clearable
            />

            <Select
              leftSection={<CiFilter />}
              placeholder="Filter by Gender"
              data={
                availableGenders.length > 0
                  ? availableGenders.map((gender) => ({
                      value: gender,
                      label: gender,
                    }))
                  : []
              }
              value={genderFilter}
              onChange={(val) => setGenderFilter(val || "")}
              clearable
            />
          </Group>
        </Group>

        <Table mt={10} stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr bg="whitesmoke">
              <Table.Th>Participants ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Class</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Modal
          opened={!!modalUserId}
          title={null}
          onClose={() => setModalUserId(null)}
        >
          <Text ta="center" fw="bold" c="red">
            Are you sure you want to delete this user?
          </Text>
          <Flex mt="xl" justify="center" gap="lg">
            <Button
              loading={isPending}
              onClick={() => handleDelete(modalUserId || "")}
              bg="red"
            >
              Yes
            </Button>
            <Button onClick={() => setModalUserId(null)} bg="green">
              No
            </Button>
          </Flex>
        </Modal>
      </Paper>
    </>
  );
};

export default EditParticipants;
