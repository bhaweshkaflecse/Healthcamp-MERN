import {
  Group,
  Button,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
// import {  DropzoneProps } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { CiCircleMinus } from "react-icons/ci";
import { subteam } from "../../../../api/subteam";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../../api";

const CreateSubTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.state);
  const [isUnitCoordinateBtnDisable, setUnitCoordinateBtnDisable] =
    useState(false);
  const [isDataEntryBtnDisable, setDataEntrybtnDisable] = useState(false);

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

  const [formData, setFormData] = useState<FormData>({
    serviceId: location.state.serviceId,
    name: "",
    description: "",
    members: [],
  });

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  useEffect(() => {
    setUnitCoordinateBtnDisable(
      formData.members.some((member: any) => member.role === "unit_coordinator")
    );
    setDataEntrybtnDisable(
      formData.members.some((member: any) => member.role === "data_entry")
    );
  }, [formData]);

  const handleRemoveMember = (id?: string) => {
    const filterMembers = formData.members.filter((member) => member.id !== id);
    const updatedFormData = {
      ...formData,
      members: filterMembers,
    };
    setFormData(updatedFormData);
    navigate(location.pathname, {
      state: { ...location.state, formData: updatedFormData },
    });
  };

  const handleCancel = () => {
    setFormData({
      serviceId: "",
      name: "",
      description: "",
      members: [],
    });
    navigate(
      `/team-list/${
        location.state.teamId ? location.state.teamId : location.state.id
      }`
    );
  };

  const handleSelectMember = (role: string) => {
    navigate("/member-list", {
      state: {
        teamId: location.state.id ? location.state.id : location.state.teamId,
        formData,
        role,
        isCreate: true,
      },
    });
  };

  const handleCreateSubTeam = async () => {
    const memberIds = formData.members.map((item) => item.id);
    const { members, ...restOfFormData } = formData;
    const body = {
      ...restOfFormData,
      memberIds,
    };
    // console.log(location.state)
    // console.log('body:',body);
    // console.log(location.state.teamId)

    const resp = await axiosPrivateInstance.post(
      `${subteam}/${location.state.teamId}`,
      body,
      {}
    );
    // console.log(resp.data)
    return resp.data;
  };

  const {
    isPending,
    // data,
    mutate: mutateCreateSubTeam,
  } = useMutation({
    mutationFn: () => handleCreateSubTeam(),
    onSuccess: () => {
      toast.success("Subteam created");
      navigate(`/team-list/${location.state.teamId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
  //  console.log(isPending)
  //   console.log(data)
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper mt={10} p={20} withBorder>
        <Title size="h4" c="primary.1" ta="center">
          Create sub Team For Eye
        </Title>
        <Text mt={5} ta="center" c="dimmed" size="sm">
          Fill all the below details for creating a new subteam for eye.
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
                    handleRemoveMember(
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
                    handleRemoveMember(
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

        <Group justify="center" mt={30}>
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            loading={isPending}
            bg="btncolor.0"
            onClick={() => mutateCreateSubTeam()}
          >
            Create
          </Button>
        </Group>
      </Paper>
    </>
  );
};

export default CreateSubTeam;
