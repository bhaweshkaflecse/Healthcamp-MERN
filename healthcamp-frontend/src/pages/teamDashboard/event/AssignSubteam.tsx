import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Input,
  Loader,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignSubteam,
  eventsubTeam,
  changeSubteam,
} from "../../../api/booking";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";

const AssignSubteam = () => {
  const [isSubTeamVisible, setIsSubTeamVisible] = useState(false);
  const [selectedSubteam, setSelectedSubteam] = useState<string | null>(null); // Track the selected switch
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const serviceId = location.state?.service?.id;
  const eventId = location.state?.dataId;
  const eventIdd = location.state?.eventIdd;
  const subteamName = location.state?.subteamName;
  const availableEnrollParticipant = location.state?.availableEnrollParticipant;
  const [error, setError] = useState<string | null>(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>();

  const isChangePage = location.state?.isChangePage;
  console.log(isChangePage);

  console.log(subteamName);
  const toggleSubTeamVisibility = () => {
    setIsSubTeamVisible((prev) => !prev);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["Assign", serviceId],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${eventsubTeam}/${serviceId}`
      );
      return response.data;
    },
  });

  const clientName = location.state?.clientName;
  console.log(clientName);
  useEffect(() => {
    if (data && subteamName && Array.isArray(subteamName)) {
      const nameToMatch = subteamName[0]; // Extract the string from the array
      console.log("Matching subteam:", nameToMatch);
      const matchedSubteam = data.find(
        (team: any) => team.name === nameToMatch
      );
      if (matchedSubteam) {
        console.log("Found match:", matchedSubteam);
        setSelectedSubteam(matchedSubteam.id);
      } else {
        console.log("No match found for subteamName");
      }
    }
  }, [data, subteamName]);

  const handleSwitchChange = (id: string) => {
    setSelectedSubteam((prevSelected) => (prevSelected === id ? null : id));
  };

  const handleSubmit = async () => {
    const body = {
      participant: numberOfParticipants,
      subteams: [selectedSubteam],
    };
    const resp = await axiosPrivateInstance.post(
      `${assignSubteam}/${eventId}`,
      body
    );
    return resp.data;
  };

  const handleChangeSubteam = async () => {
    const resp = await axiosPrivateInstance.patch(
      `${changeSubteam}/${eventIdd}?subteamId=${selectedSubteam}`
    );
    return resp.data;
  };

  const { isPending: isAssigning, mutate: assignMutate } = useMutation({
    mutationFn: () => handleSubmit(),
    mutationKey: ["assignTeam"],
    onSuccess: () => {
      navigate("/upcoming-events");
      toast.success("Assigned subteam successfully");
      queryClient.invalidateQueries({ queryKey: ["assignTeam"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingEventsData"] });
    },
    onError: () => {
      toast.error("Unable to Assign subteam");
    },
  });

  const { isPending: isChanging, mutate: changeMutate } = useMutation({
    mutationFn: () => handleChangeSubteam(),
    mutationKey: ["changeTeam"],
    onSuccess: () => {
      toast.success("Changed subteam successfully");
      queryClient.invalidateQueries({ queryKey: ["assignTeam"] });
      queryClient.invalidateQueries({
        queryKey: ["BookingDAta"],
        exact: true,
        // refetchType: true,
      });
      navigate("/event-calendar", { state: eventId });
    },
    onError: () => {
      toast.error("Unable to Change subteam");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setNumberOfParticipants(value);

    if (value > availableEnrollParticipant) {
      setError(
        `Cannot assign more than ${availableEnrollParticipant} participants.`
      );
    } else {
      setError(null); // Clear error when value is valid
    }
  };

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
    console.error(error);
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Event Calendar
      </Title>
      <Paper withBorder mt={10} p={20}>
        <Text fw={600} ta="center">
          {isChangePage
            ? `Changing Sub Team for the event booked by ${clientName}`
            : `Assigning Sub Team for the event booked by ${clientName}`}
        </Text>
        <Text ta="center" size="sm" c="dimmed">
          {isChangePage
            ? "Please change the assigned subteam for the event organizing venue."
            : "Please assign your prepared subteam to the event organizing venue to commence the organization process for the client's event."}
        </Text>
        <Text ta="center" fw={600} mt={20} c="primary.0">
          Your Sub Teams
        </Text>
        <Paper bg="primary.0" mt={10} p={20} withBorder>
          <Group justify="space-between">
            <Text c="white">{location.state?.service?.name}</Text>
            <FaChevronDown
              size={25}
              color="white"
              onClick={toggleSubTeamVisibility}
              style={{ cursor: "pointer" }}
            />
          </Group>
        </Paper>
        {isSubTeamVisible && (
          <Paper withBorder p={10}>
            {data?.map((item: any) => (
              <Paper key={item.id} bg="#E8E8E8" mt={10} p={10}>
                <Group justify="space-between">
                  <Text fw={400} mt={2} c="primary.0">
                    {item?.name}
                  </Text>
                  <Switch
                    checked={selectedSubteam === item.id}
                    onChange={() => handleSwitchChange(item.id)}
                  />
                </Group>
              </Paper>
            ))}
          </Paper>
        )}
        <Center>
          {isChangePage === "change" ? (
            <Group mt={20}>
              <Badge p={10} color="green" variant="filled" size="lg">
                Number of participant left: {availableEnrollParticipant}
              </Badge>
              <Input
                error={error}
                value={numberOfParticipants}
                onChange={handleInputChange}
                type="number"
                placeholder="enter number of participants"
              />
              {error && <Text c="red">{error}</Text>} {/* Show error message */}
              <Button
                variant="btncolor.1"
                loading={isAssigning}
                onClick={() => assignMutate()}
                disabled={!selectedSubteam || !!error}
              >
                Assign
              </Button>
            </Group>
          ) : (
            <Group mt={20}>
              <Button
                bg="btncolor.1"
                loading={isChanging}
                onClick={() => changeMutate()}
                disabled={!selectedSubteam} // Disable if no subteam selected
              >
                Change Subteam
              </Button>
            </Group>
          )}
        </Center>
      </Paper>
    </>
  );
};

export default AssignSubteam;
