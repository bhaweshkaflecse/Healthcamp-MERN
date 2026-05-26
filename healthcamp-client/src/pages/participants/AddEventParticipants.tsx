import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Input,
  Loader,
  Paper,
  Table,
  Text,
} from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import { IoPeopleSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getAllParticipantsInEventAPI } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AddEventParticipants = () => {
  const location = useLocation();
  const { id } = location?.state;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  if (!id) {
    return <Text c="red">Event id is not present</Text>;
  }

  const getAllParticInEvents = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getAllParticipantsInEventAPI}/${id}`
    );
    return resp.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`get-all-parti-in-events/${id}`],
    queryFn: getAllParticInEvents,
  });

 
  const existingData = data?.eventDetails?.[0]?.participants;

  const filteredData = existingData?.filter(
    (item: any) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.id?.toString()?.includes(searchQuery)
  );

  const rows = (
    <>
      {filteredData?.map((item: any) => (
        <Table.Tr key={item?.id}>
          <Table.Td>{item?.id}</Table.Td>
          <Table.Td>{item?.name}</Table.Td>
          <Table.Td>{item?.gender}</Table.Td>
          <Table.Td>{item?.grade}</Table.Td>
          <Table.Td>{item?.contact}</Table.Td>
          <Table.Td>{item?.email}</Table.Td>
        </Table.Tr>
      ))}
    </>
  );

  if(isLoading){
    return (


          <Center h="50vh">
          <Box ta="center">
            <Loader color="blue" />
          </Box>
        </Center>

  
    )
  }

  return (
    <Box>
      <Paper withBorder p="xl">
        <Flex justify="space-between" align="center">
          <Flex my="lg" direction="column" gap="xs">
            <Group>
              <IoPeopleSharp />
              <Box>
                <Text size="sm">
                  Total Participants Required:
                  <strong>{data?.eventDetails?.[0]?.participant}</strong>
                </Text>
              </Box>
            </Group>
            <Group>
              <IoPeopleSharp />
              <Box>
                <Text size="sm">
                  Total Participants Uploaded:
                  <strong>{existingData?.length || 0}</strong>
                </Text>
              </Box>
            </Group>
          </Flex>

          <Button
            onClick={() =>
              navigate("/enroll-participants", {
                state: { id: data?.eventDetails?.[0]?.id, existingData: existingData },
              })
            }
          >
            Enroll Participants
          </Button>
        </Flex>

        <Group mt={20} justify="space-between">
          <Text fw={550}>Participants</Text>
          <Group>
            <Input
              leftSection={<CiSearch />}
              placeholder="Search by Name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Group>
        </Group>

        {existingData && existingData.length === 0 ? (
          <Text c="dimmed" ta="center">No participants yet.</Text>
        ) : (
          <Table mt={10} stickyHeader stickyHeaderOffset={60}>
            <Table.Thead>
              <Table.Tr c="white" bg="blue">
                <Table.Th>Participants ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>Class</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Email</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default AddEventParticipants;
