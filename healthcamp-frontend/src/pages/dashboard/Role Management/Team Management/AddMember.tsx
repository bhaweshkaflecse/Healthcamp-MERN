import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Paper,
  Space,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addmember, getbyrole, leaderchange } from "../../../../api/team";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../../api";

interface Member {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface LocationState {
  role: string;
  id: string;
  members: Member[];
}

const AddMember = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const locationState = location.state as LocationState;
  const [role] = useState(locationState?.role);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberDetails, setMemberDetails] = useState<Member[]>([]);

  const adminRole: Record<string, string> = {
    data_entry: "Data Entry",
    unit_coordinator: "Unit Cooridinator",
    finance: "Finance",
    sales: "Sales",
    call_centre: "Call Center",
    IT_team: "IT Team",
    custom: "Custom Members",
    teamLead: "team_lead",
  };

  const fetchMembers = async () => {
    const response = await axiosPrivateInstance.get(
      `${getbyrole}?role=${locationState.role}`,
      {}
    );
    return response.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: [`AddMember${role}`],
    queryFn: fetchMembers,
    enabled: !!role, // Only fetch when role is available
  });

  const handleSwitchChange = (member: Member) => {
    if (role === "team_lead") {
      setSelectedMembers([member.id]);
      setMemberDetails([member]);
    } else {
      setSelectedMembers((prev) => {
        const isSelected = prev.includes(member.id);
        if (isSelected) {
          setMemberDetails((prevDetails) =>
            prevDetails.filter((detail) => detail.id !== member.id)
          );
          return prev.filter((id) => id !== member.id);
        } else {
          setMemberDetails((prevDetails) => [...prevDetails, member]);
          return [...prev, member.id];
        }
      });
    }
  };

  const handleUpdate = async () => {
    if (role === "team_lead") {
      const response = await axiosPrivateInstance.patch(
        `${leaderchange}?teamLeaderId=${memberDetails[0]?.id}&teamId=${locationState.id}`,
       
      );
      return response.data;
    } else {
      const response = await axiosPrivateInstance.post(
        `${addmember}/${locationState.id}`,
        {
          memberId: Array.from(
            new Set(memberDetails.map((member) => member.id))
          ),
        },
        {}
      );
      return response.data;
    }
  };

  const { isPending, mutate: addMutate } = useMutation({
    mutationFn: handleUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return typeof queryKey === "string" && queryKey.startsWith("team");
        },
      });
      navigate(`/team-list/${locationState.id}`);
      toast.success("Member(s) have been updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

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
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper withBorder p={10} mt={10}>
        <Group justify="space-between">
          <Title size="h3">{adminRole[role] || "Unknown Role"}</Title>
        </Group>
        <Group mt={40} gap={60}>
          {data?.map((item: Member) => {
            const isMemberAlreadyAdded = locationState.members?.some(
              (member) => member.id === item.id
            );

            if (isMemberAlreadyAdded) {
              return null;
            }

            return (
              <Paper key={item.id} withBorder>
                <Group p={10} justify="end">
                  <Switch
                    checked={selectedMembers.includes(item.id)}
                    onChange={() => handleSwitchChange(item)}
                  />
                </Group>
                <Flex
                  w="auto"
                  p={10}
                  align="center"
                  wrap="wrap"
                  direction="column"
                >
                  <Image
                    radius={80}
                    w={100}
                    src={item?.profile||"/img/teamlead.jpg"}
                  />
                  <Text mt={10} fw={650}>
                    {item.name}
                  </Text>
                  <Text>{item.email}</Text>
                </Flex>
              </Paper>
            );
          })}
        </Group>
        <Space h={200} />
        <Center>
          <Button
            bg="btncolor.0"
            loading={isPending}
            onClick={() => addMutate()}
            disabled={selectedMembers.length === 0}
          >
            {role === "team_lead" ? "Confirm Leader" : "Add Members"}
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default AddMember;
