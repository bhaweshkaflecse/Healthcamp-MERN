import {
  Box,
  Button,
  Group,
  Input,
  Paper,
  Table,
  Text,
  Title,
  Loader,
  Center,
  Select,
} from "@mantine/core";
import { IoMdAdd } from "react-icons/io";
import { CiEdit, CiSearch, CiFilter } from "react-icons/ci";
import { IoPeople } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getParticipants } from "../../api/participants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Participants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const getParti = async () => {
    const resp = await axiosPrivateInstance.get(getParticipants);
    return resp.data;
  };

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registeredUsers"],
    queryFn: getParti,
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  if (error) {
    return (
      <Text c="red" ta="center">
        An error occurred while fetching data.
      </Text>
    );
  }

  const uniqueClasses = [
    ...new Set(users?.map((u: any) => u.grade).filter(Boolean)),
  ] as number[];

  const classOptions = uniqueClasses
    .map((c) => ({
      value: c.toString(),
      label: `Class ${c}`,
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

  const filteredUsers = users?.filter((element: any) => {
    const matchesSearch =
      element?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element?.id.toString().includes(searchQuery);

    const matchesClass = selectedClass
      ? element.grade.toString() === selectedClass
      : true;

    const matchesGender = selectedGender
      ? element.gender?.toLowerCase() === selectedGender.toLowerCase()
      : true;

    return matchesSearch && matchesClass && matchesGender;
  });

  const rows = filteredUsers?.map((element: any) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.id}</Table.Td>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.gender}</Table.Td>
      <Table.Td>{element?.grade}</Table.Td>
      <Table.Td>{element?.contact}</Table.Td>
      <Table.Td>{element?.email}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title size={22} fw="bold" c="blue" mb="sm">
        Participants Details
      </Title>
      <Paper withBorder p={20} mt={10} shadow="xs">
        <Group justify="space-between" align="center">
          <Text w={700}>Available Participants</Text>
          <Group>
            <Button
              onClick={() => navigate("/add-new-participant")}
              leftSection={<IoMdAdd color="white" />}
              style={{ backgroundColor: "#007BFF", color: "white" }}
            >
              Add New Participant
            </Button>
            <Button
              onClick={() => navigate("/edit-participants")}
              variant="default"
              leftSection={<CiEdit />}
            >
              Edit Participants
            </Button>
          </Group>
        </Group>

        <Group mt={20} align="center">
          <IoPeople size={24} />
          <Box ml={10}>
            <Text>Total Participants</Text>
            <Text w={600} size="xl">
              {users?.length}
            </Text>
          </Box>
        </Group>

        <Group mt={20} justify="space-between">
          <Text w={550}>Participants List</Text>
          <Group>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<CiSearch />}
              placeholder="Search by Name or ID"
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by Class"
              leftSection={<CiFilter />}
              style={{ width: 200 }}
              data={[{ value: "", label: "All Classes" }, ...classOptions]}
              value={selectedClass ?? ""}
              onChange={(value) =>
                setSelectedClass(value === "" ? null : value)
              }
              clearable
            />
            <Select
              placeholder="Filter by Gender"
              leftSection={<CiFilter />}
              style={{ width: 200 }}
              data={[
                { value: "", label: "All Genders" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              value={selectedGender ?? ""}
              onChange={(value) =>
                setSelectedGender(value === "" ? null : value)
              }
              clearable
            />
          </Group>
        </Group>

        <Table mt={20} stickyHeader>
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: "#f5f5f5" }}>
              <Table.Th>Participant ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Class</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </>
  );
};

export default Participants;
