import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Loader,
  Paper,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { axiosPrivateInstance } from "../../api";
import {
  addparticipantInEventAPI,
  getNonEnrolledParticipants,
} from "../../api/participants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorAxios from "../../components/ErrorAxios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface Users {
  id: string;
  name: string;
  participantId: string;
  gender: string;
  grade: number;
  address: string;
  contact: string;
  email: string;
  status: string;
}

const EnrollParticipants = () => {
  const [filteredData, setFilteredData] = useState<Users[]>([]);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [gradeOptions, setGradeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [genderOptions, setGenderOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const location = useLocation();
  const { id } = location?.state;
  const existingData = location?.state?.existingData;

  const queryClient = useQueryClient();

  if (!id) {
    return <Text>Id is absent</Text>;
  }

  const getParti = async () => {
    const resp = await axiosPrivateInstance.get(`${getNonEnrolledParticipants}/${id}`);
    return resp.data;
  };

  const pushToTheParticipants = async () => {
    const participantIds = Object.keys(checkedState);
    const resp = await axiosPrivateInstance.post(
      `${addparticipantInEventAPI}/${id}`,
      { participantIds }
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["participants-lists"],
    mutationFn: pushToTheParticipants,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`get-all-parti-in-events/${id}`],
        exact: true,
      });

      return toast.success("Participants enrolled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registeredUsers"],
    queryFn: getParti,
  });

  useEffect(() => {
    if (users) {
      const eligibleUsers = users.filter((fillUser: any) => {
        return !existingData.some((item: any) => fillUser.id === item.id);
      });
  
      setFilteredData(eligibleUsers);
  
      // Explicitly cast the result of map to strings
      const grades = Array.from(
        new Set(eligibleUsers.map((user: Users) => String(user.grade))) // Force type as string here
      ).map((grade) => ({
        value: grade as string,  // Explicit type assertion
        label: grade as string,  // Explicit type assertion
      }));
  
      const genders = Array.from(
        new Set(eligibleUsers.map((user: Users) => String(user.gender))) // Force type as string here
      ).map((gender) => ({
        value: gender as string, // Explicit type assertion
        label: gender as string, // Explicit type assertion
      }));
  
      // Now, set options for grades and genders
      setGradeOptions([{ value: "all", label: "All" }, ...grades]);
      setGenderOptions([{ value: "all", label: "All" }, ...genders]);
    }
  }, [users, existingData]);
  
  

  const onFilter = (value: string | null, type: "grade" | "gender") => {
    if (value === "all" || value === null) {
      
      setFilteredData(users.filter((fillUser: any) => !existingData.some((item: any) => fillUser.id === item.id)));
    } else {
      const filtered = users.filter((data: any) =>
        !existingData.some((item: any) => data.id === item.id) &&
        (type === "grade" ? Number(data.grade) === Number(value) : data.gender === value)
      );
      setFilteredData(filtered);
    }
  };

  const handleCheckboxChange = (id: string, e: any) => {
    const isChecked = e.target.checked;

    setCheckedState((prevState) => {
      const newState = { ...prevState };
      if (isChecked) {
        newState[id] = true;
      } else {
        delete newState[id];
      }
      return newState;
    });
  };

  const handleSelectAll = () => {
    setCheckedState((prevState) => {
      const newState = { ...prevState };
      const allSelected = filteredData.every((item: any) => newState[item.id]);

      if (allSelected) {
        filteredData.forEach((item: any) => {
          delete newState[item.id];
        });
      } else {
        filteredData.forEach((item: any) => {
          newState[item.id] = true;
        });
      }

      return newState;
    });
  };

  const rows = filteredData.map((info: Users) => (
    <Table.Tr key={info?.participantId}>
      <Table.Td>
        <Flex gap="xs">
          <Checkbox
            onChange={(e) => handleCheckboxChange(info?.id, e)}
            checked={checkedState[info.id] || false}
          />
          {info?.id}
        </Flex>
      </Table.Td>
      <Table.Td>{info?.name}</Table.Td>
      <Table.Td>{info?.gender}</Table.Td>
      <Table.Td>{info?.grade}</Table.Td>
      <Table.Td>+977 {info?.contact}</Table.Td>
      <Table.Td>{info?.email}</Table.Td>
    </Table.Tr>
  ));

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
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  return (
    <Paper p={30} withBorder>
      <Title size={22} fw="bold" c="blue">
        Enroll Participants
      </Title>

      <Flex justify="space-between">
        <Flex my="lg" direction="column" gap="xs">
          <Group>
            <IoPeopleSharp />
            <Box>
              <Text size="sm">
                Total Participants: <strong>{users?.length}</strong>
              </Text>
            </Box>
          </Group>
          <Group>
            <IoPeopleSharp />
            <Box>
              <Text size="sm">
                Total Participants Selected:{" "}
                <strong>{Object?.values(checkedState)?.length}</strong>
              </Text>
            </Box>
          </Group>
        </Flex>

        <Button
          onClick={() => mutate()}
          loading={isPending}
          disabled={Object?.values(checkedState)?.length === 0}
          bg="green"
        >
          Push to the participant lists
        </Button>
      </Flex>

      <Flex my="md" align="center" justify="space-between">
        <Button
          onClick={handleSelectAll}
          c="black"
          my="xs"
          size="xs"
          bg="#89CFF0"
        >
          {filteredData.every((item: any) => checkedState[item.id])
            ? "Unselect All"
            : "Select All"}
        </Button>

            <Group>
        <Select
          value={selectedGrade || undefined}
          onChange={(value) => {
            setSelectedGrade(value);
            onFilter(value, "grade");
          }}
          placeholder="Filter by Grade"
          data={gradeOptions}
        />

        <Select
          value={selectedGender || undefined}
          onChange={(value) => {
            setSelectedGender(value);
            onFilter(value, "gender");
          }}
          placeholder="Filter by Gender"
          data={genderOptions}
        />
        </Group>
      </Flex>

      <Table mt={10} stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr bg="whitesmoke">
            <Table.Th>Participants ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Gender</Table.Th>
            <Table.Th>Grade</Table.Th>
            <Table.Th>Contact</Table.Th>
            <Table.Th>Email</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
};

export default EnrollParticipants;
