import {
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { getteam, memberchange } from "../../../../api/team";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../../api";

interface Team {
  id: string;
  name: string;
}

interface LocationState {
  teamId: string;
  memberId: string;
  memberName?: string;
}

interface FormData {
  teamId: string;
  nextTeamId: string;
  adminId: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const ChangeTeam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;

  // Validate location state
  if (!locationState?.teamId || !locationState?.memberId) {
    navigate("/role");
    toast.error("Invalid navigation state");
    return null;
  }

  const [formData, setFormData] = useState<FormData>({
    teamId: locationState.teamId,
    nextTeamId: "",
    adminId: locationState.memberId,
  });

  // Combined query for team data
  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get<Team[]>(getteam, {});
      return response.data;
    },
    select: (data): SelectOption[] =>
      data.map((team) => ({
        value: team.id,
        label: team.name,
      })),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
  });
  console.log(teams)
  const { mutate: handleTeamChange, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivateInstance.patch(
        memberchange,
        formData,
        {}
      );
      return response.data;
    },
    onSuccess: () => {
      navigate("/role", { state: { showUpdateToast: true } });
      toast.success("Team has been changed");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Team change error:", error);
    },
  });

  const handleSelectChange = (value: string | null) => {
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      nextTeamId: value,
    }));
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  const canSaveChanges = Boolean(formData.nextTeamId);

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Text fw={600}>Changing Team</Text>
        <Center>
          {/* <Image
            mt={30}
            radius="50%"
            w={150}
            src={"/img/teamlead.jpg"}
          /> */}
        </Center>
        <Text mt={15} ta="center">
          You can assign {locationState.memberName || "the member"} to other
          subteams of the same team as well as other teams.
        </Text>
        <Center>
          <Select
            mt={15}
            data={teams || []}
            value={formData.nextTeamId}
            onChange={handleSelectChange}
            placeholder="Select a team"
            error={!formData.nextTeamId && "Please select a team"}
            required
          />
        </Center>

        <Group mt={30} justify="center">
          <Button
            variant="default"
            onClick={() => navigate("/role")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            loading={isPending}
            onClick={() => handleTeamChange()}
            disabled={!canSaveChanges}
          >
            Save
          </Button>
        </Group>
      </Paper>
    </>
  );
};

export default ChangeTeam;