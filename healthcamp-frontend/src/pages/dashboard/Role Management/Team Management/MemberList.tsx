import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Input,
  Loader,
  Menu,
  Modal,
  Paper,
  Space,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { CiSearch, CiFilter } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  getMemberByRole } from "../../../../api/team";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addMember } from "../../../../api/subteam";
import { axiosPrivateInstance } from "../../../../api";

interface Member {
  id: string;
  name: string;
  role: string;
}
const MemberList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(location.state?.role);
  const [selectedMember, setSelectedMember] = useState("");
  const [checked, setChecked] = useState(false);
  const [memberDetails, setMemberDetails] = useState<Member>();
  const [opened, { close }] = useDisclosure(false);
  const formData = location.state?.formData;
  const teamId = location.state?.teamId;
  console.log(location.state);
  const subteamId = location.state?.subteamId;
  interface AdminRole {
    [key: string]: string;
  }
  const adminRole: AdminRole = {
    data_entry: "Data Entry",
    unit_coordinator: "Unit Cooridinator",
    finance: "Finance",
    sales: "Sales",
    call_centre: "Call Center",
    IT_team: "IT Team",
    custom: "Custom Members",
  };
  const fetchMembers = async () => {
    {
      const response = await axiosPrivateInstance.get(
        `${getMemberByRole}/${teamId}`,
        {
          params: {
            role,
          },
        }
      );
      return response.data;
    }
  };

  const { isLoading, data, refetch } = useQuery({
    queryKey: [`memberList${role}`],
    queryFn: fetchMembers,
  });
  console.log(data);

  useEffect(() => {
    refetch();
  }, [role, refetch]);

  const handleSwitchChange = (member: any) => {
    ``;
    setChecked(selectedMember != member.id ? true : !checked);
    setSelectedMember(checked ? member.id : "");
    setMemberDetails({ id: member.id, name: member.name, role });
  };

  const handleAddMember = async () => {
    const resp = await axiosPrivateInstance.post(
      `${addMember}?memberId=${selectedMember}&subTeamId=${subteamId}`
    );
    return resp.data;
  };

  const {
    // isPending,
    // data:addData,
    mutate: addMutate,
  } = useMutation({
    mutationFn: () => handleAddMember(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subTeam"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Member added");
      navigate(`/subteam/${subteamId}`);
    },
    onError: () => {
      toast.error("Unable to add member");
    },
  });

  // console.log(addData)

  const handleConfirmLeader = () => {
    if (!formData) {
      console.error("formData is undefined or has an invalid structure");
      return;
    }

    formData.members.some((member: any) => member.id === memberDetails?.id);
    const updatedFormData = {
      ...formData,
      members: [...formData.members, memberDetails],
    };

    location.state.isCreate
      ? navigate("/create-subteam", {
          state: { teamId: location.state.teamId, formData: updatedFormData },
        })
      : addMutate();
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
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper withBorder p={10} mt={10}>
        <Group justify="space-between">
          <Title size="h3">{adminRole[role]}</Title>
          <Group justify="flex-end">
            <Input
              variant="filled"
              radius={10}
              placeholder="Search by Name or Email"
              leftSection={<CiSearch size={16} />}
            />
            {role != "unit_coordinator" && role != "data_entry" && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="default"
                    bg="#F1F3F5"
                    radius={10}
                    leftSection={<CiFilter size={16} />}
                  >
                    Filter
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Select role</Menu.Label>
                  <Menu.Item onClick={() => setRole("sales")}>Sales</Menu.Item>
                  <Menu.Item onClick={() => setRole("finance")}>
                    Finance
                  </Menu.Item>
                  <Menu.Item onClick={() => setRole("call_centre")}>
                    Call center
                  </Menu.Item>
                  <Menu.Item onClick={() => setRole("IT_team")}>
                    IT team
                  </Menu.Item>
                  {/* <Menu.Item onClick={() => setRole("custom")}>
                  Custom member
                </Menu.Item> */}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
        <Group mt={40} gap={60}>
          {data?.map((item: any, index: any) => {
            return (
              <React.Fragment key={index}>
                {!formData?.members.some(
                  (member: any) => member.id === item.id
                ) && (
                  <Paper key={index} withBorder>
                    <Group p={10} justify="end">
                      <Switch
                        checked={item.id == selectedMember ? true : false}
                        onChange={() => handleSwitchChange(item)}
                      />
                    </Group>
                    <Flex
                      w={200}
                      p={10}
                      align="center"
                      wrap="wrap"
                      direction={"column"}
                    >
                      <Image radius={80} w={100} src="/img/teamlead.jpg" />
                      <Text mt={10} fw={650}>
                        {item.name}
                      </Text>
                      <Text>{item.email}</Text>
                    </Flex>
                  </Paper>
                )}
              </React.Fragment>
            );
          })}
        </Group>
        <Space h={200} />
        <Modal opened={opened} onClose={close}>
          <Center>
            <CgDanger size={25} color="red" />
          </Center>
          <Text mt={10} fw={600} ta="center">
            Are you sure you want to delete?
          </Text>
          <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
            The action of deletion cannot be undone. Are you sure you want to
            proceed deleting this service?
          </Text>
          <Group mt={20} justify="center">
            <Button variant="default">Cancel</Button>
            <Button color="red">Delete</Button>
          </Group>
        </Modal>
        <Center>
          <Button
            bg="btncolor.0"
            // onClick={() => {
            // dispatch(setSubTeam({member:memberDetails}))
            // const formData=location.state.formData;
            // formData.member.push(memberDetails);
            // navigate("/create-subteam", {
            //   state: {formData},
            // });
            // }}
            onClick={handleConfirmLeader}
          >
            Confirm Leader
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default MemberList;
