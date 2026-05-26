import {
  Group,
  Button,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
  Box,
  Modal,
  Center,
} from "@mantine/core";
// import { DropzoneProps } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { CiCircleMinus } from "react-icons/ci";
import { removeMember, subteam } from "../../../../api/subteam";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CgDanger } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { axiosPrivateInstance } from "../../../../api";

const EditSubTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  console.log(location.state)
  const [isUnitCoordinateBtnDisable, setUnitCoordinateBtnDisable] =
    useState(false);
  const [isDataEntryBtnDisable, setDataEntrybtnDisable] = useState(false);
  const [opened, { open: deleteModelOpen, close }] = useDisclosure(false);
  const [selectedMember, setSelectedMember] = useState("");
  console.log(location.state);
  interface OriginalObject {
    address: string;
    department: string;
    id: string;
    name: string;
  }

  interface FormData {
    serviceId: string;
    name: string;
    description: string;
    members: Member[];
  }

  interface Member {
    id: string;
    name: string;
    role: string;
  }

  const admin: OriginalObject[] = location.state.admin;

  const [formData, setFormData] = useState<FormData>({
    serviceId: "",
    name: "",
    description: "",
    members: [],
  });

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    } else {
      setFormData({
        serviceId: location.state.service.id,
        name: location.state.name,
        description: location.state.description,
        members: admin.map(({ address, department, ...rest }) => ({
          ...rest,
          role: department,
        })),
      });
    }
    // console.log("formData:", formData);
  }, [location.state]);

  useEffect(() => {
    setUnitCoordinateBtnDisable(
      formData.members.some((member: any) => member.role === "unit_coordinator")
    );
    setDataEntrybtnDisable(
      formData.members.some((member: any) => member.role === "data_entry")
    );
  }, [formData]);

  const handleRemovemember = async (id?: string) => {
    id && setSelectedMember(id);
    deleteModelOpen();
  };

  const handleSelectMember = (role: string) => {
    navigate("/member-list", {
      state: {
        teamId: location.state.team?.id
          ? location.state?.team?.id
          : location.state?.team?.id,
        formData,
        subteamId: location.state.id,
        role,
        isCreate: false,
        
      },
    });
  };

  const handleUpdateSubTeam = async () => {
    const body = {
      name: formData.name,
      description: formData.description,
    };
    const resp = await axiosPrivateInstance.patch(
      `${subteam}/${
        location.state.id ? location.state.id : location.state.teamId
      }`,
      body,
      {
        params: {
          memberId: selectedMember,
          subTeamId: location.state.id
            ? location.state.id
            : location.state.teamId,
        },
      }
    );
    return resp.data;
  };

  const handleRemoveMember = async () => {
    const resp = await axiosPrivateInstance.delete(removeMember, {
      params: {
        memberId: selectedMember,
        subTeamId: location.state.id
          ? location.state.id
          : location.state.teamId,
      },
    });
    return resp.data;
  };

  const {
    isPending,
    // data,
    mutate: removeMutate,
  } = useMutation({
    mutationFn: () => handleRemoveMember(),
    mutationKey: ["removeMember"],
    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({
        queryKey: ["subTeam"],
        refetchType: "active",
        exact: true,
      });
      navigate(
        `/subteam/${
          location.state.id ? location.state.id : location.state.teamId
        }`
      );
    },
    onError: () => {
      toast.error("Unable to delete member");
    },
  });

  const {
    // isPending:updatePending,
    // data:updateData,
    mutate: updateMutate,
  } = useMutation({
    mutationFn: () => handleUpdateSubTeam(),
    mutationKey: ["updateMember"],
    onSuccess: () => {
      toast.success("Sub-team updated");
      queryClient.invalidateQueries({
        queryKey: ["subTeam"],
        refetchType: "active",
        exact: true,
      });
      navigate(
        `/subteam/${
          location.state.id ? location.state.id : location.state.teamId
        }`
      );
    },
    onError: () => {
      toast.error("Unable to update subteam");
    },
  });

  // console.log(isPending);
  // console.log(updateData);

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Title size="h4" c="primary.1" ta="center">
          Update sub Team For {location.state.name}
        </Title>
        <Text mt={5} ta="center" c="dimmed" size="sm">
          Fill all the below details to update subteam.
        </Text>
        <Text fw={600} mt={20} c="primary.0">
          Sub Team Name
        </Text>
        <TextInput
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }));
            // setName(e.target.value)
          }}
          mt={5}
          placeholder="Enter Sub Team Name"
        />
        <Text fw={600} mt={20} c="primary.0">
          Sub Team Description
        </Text>
        <Textarea
          value={formData.description}
          // onChange={(e) => setDescription(e.target.value)}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          mt={5}
          placeholder="Enter Sub Team Description"
        />
        <Text fw={600} mt={20} c="primary.0">
          Unit Cordinator
        </Text>
        <Paper withBorder p={20} mt={5}>
          {formData.members.some(
            (member: any) => member.role === "unit_coordinator"
          ) && (
            <Paper withBorder p={10}>
              <Group justify="space-between">
                <Text>
                  {
                    formData.members.find(
                      (member: any) => member.role === "unit_coordinator"
                    )?.name
                  }
                </Text>
                <CiCircleMinus
                  color="red"
                  size={20}
                  onClick={() =>
                    handleRemovemember(
                      formData.members.find(
                        (member: any) => member.role === "unit_coordinator"
                      )?.id
                    )
                  }
                />
              </Group>
            </Paper>
          )}

          <Group mt={20} justify="right">
            <Button
              onClick={() => handleSelectMember("unit_coordinator")}
              bg="primary.0"
              rightSection={<IoMdAdd size={16} />}
              disabled={isUnitCoordinateBtnDisable}
            >
              Add UnitCoordinator
            </Button>
          </Group>
        </Paper>
        <Text fw={600} mt={20} c="primary.0">
          Data Entry
        </Text>
        <Paper withBorder p={20} mt={5}>
          {formData.members.some(
            (member: any) => member.role === "data_entry"
          ) && (
            <Paper withBorder p={10}>
              <Group justify="space-between">
                <Text>
                  {
                    formData.members.find(
                      (member: any) => member.role === "data_entry"
                    )?.name
                  }
                </Text>
                <CiCircleMinus
                  color="red"
                  size={20}
                  onClick={() =>
                    handleRemovemember(
                      formData.members.find(
                        (member: any) => member.role === "data_entry"
                      )?.id
                    )
                  }
                />
              </Group>
            </Paper>
          )}
          <Group mt={20} justify="right">
            <Button
              bg="primary.0"
              onClick={() => handleSelectMember("data_entry")}
              rightSection={<IoMdAdd size={16} />}
              disabled={isDataEntryBtnDisable}
            >
              Add Data Entry
            </Button>
          </Group>
        </Paper>
        <Text fw={600} mt={20} c="primary.0">
          Add Members
        </Text>
        <Paper withBorder p={20} mt={5}>
          {formData.members &&
            formData.members
              .filter(
                (member) =>
                  member.role !== "data_entry" &&
                  member.role !== "unit_coordinator"
              )
              .map((member) => (
                <Box>
                  <Text fw={400} mt={2} c="primary.0">
                    {member.role}
                  </Text>
                  <Paper withBorder p={10} key={member.id} mt={10}>
                    <Group justify="space-between">
                      <Text>{member.name}</Text>
                      <CiCircleMinus
                        color="red"
                        size={20}
                        onClick={() => handleRemovemember(member.id)}
                      />
                    </Group>
                  </Paper>
                </Box>
              ))}

          <Group mt={20} justify="right">
            <Button
              bg="primary.0"
              onClick={() => handleSelectMember("sales")}
              rightSection={<IoMdAdd size={16} />}
            >
              Add Members
            </Button>
          </Group>
        </Paper>
        <Group justify="center" mt={30}>
          <Button
            variant="default"
            onClick={() => {
              navigate(
                `/subteam/${
                  location.state.id ? location.state.id : location.state.teamId
                }`
              );
            }}
          >
            Cancel
          </Button>
          <Button bg="btncolor.0" onClick={() => updateMutate()}>
            Update
          </Button>
        </Group>
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
            <Button variant="default" onClick={() => close()}>
              Cancel
            </Button>
            <Button
              loading={isPending}
              onClick={() => removeMutate()}
              color="red"
            >
              Delete
            </Button>
          </Group>
        </Modal>
      </Paper>
    </>
  );
};

export default EditSubTeam;
