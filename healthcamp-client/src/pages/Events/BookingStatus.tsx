import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Loader,
  Paper,
  Space,
  Text,
  Title,
  Badge,
  Avatar,
  Divider,
} from "@mantine/core";
import { IoLocationSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getEventMemberDetailsAPI } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import ErrorAxios from "../../components/ErrorAxios";

interface BookingStatus {
  id: string;
  status: string;
  subteam: SubTeamDetail[];
  bookingDate: BookingDate;
}

interface SubTeamDetail {
  id: string;
  subTeam: SubTeam;
}

interface SubTeam {
  id: string;
  name: string;
  admin: AdminDetail[];
}

interface AdminDetail {
  id: string;
  name: string;
  department: string;
}

interface BookingDate {
  id: string;
  date: string;
}

const BookingStatus = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  
  const eventsInfo = location.state?.info;

  if (!id) {
    return <Text color="red">Event ID is missing!</Text>;
  }

  const eventMembersDetail = async (): Promise<BookingStatus> => {
    const resp = await axiosPrivateInstance(`${getEventMemberDetailsAPI}/${id}`);
    return resp.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["get-members-detail"],
    queryFn: eventMembersDetail,
  });

  console.log('event data', data)

  if (error) {
    return (
      <ErrorAxios
        error={error}
        fallbackMessage="An error occurred while fetching the event details."
      />
    );
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <Box>
      <Paper withBorder radius="md" shadow="sm" p="lg" m="xl">
        <Flex justify="space-between" align="center" mb="md">
          <Box>
            <Title order={3} mb={5}>
              {eventsInfo?.enrollPackage?.package?.name}
            </Title>
            <Text size="sm" color="dimmed" maw={500}>
              {eventsInfo?.enrollPackage?.package?.description}
            </Text>
            <Space h="sm" />
            <Flex align="center" gap={8}>
              <IoLocationSharp size={18} color="#1C7ED6" />
              <Text size="sm">{eventsInfo?.venue}</Text>
            </Flex>
          </Box>

          <Flex direction="column" align="end" gap="xs">
            <Badge color="blue" size="lg" radius="md" variant="light">
              {location.state?.date}
            </Badge>
            <Button onClick={() => navigate('/add-event-participants', { state: { id } })}>
              View Participants
            </Button>
          </Flex>
        </Flex>
      </Paper>

      <Paper withBorder radius="md" p="xl" m="xl" shadow="xs">
        <Title order={4} mb="md">Event Admins</Title>
        <Divider mb="lg" />

        <Grid gutter="lg">
          {data?.subteam?.[0]?.subTeam?.admin?.map((admin: AdminDetail) => (
            <Grid.Col key={admin.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Paper radius="md" withBorder p="md" shadow="xs">
                <Flex direction="column" align="center" gap="sm">
                  <Avatar
                    src="https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0="
                    size={90}
                    radius="xl"
                  />
                  <Text fw={600}>{admin?.name}</Text>
                  <Text size="sm" color="dimmed" ta="center">
                    {admin?.department
                      .split("_")
                      .join(" ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Text>
                </Flex>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default BookingStatus;
