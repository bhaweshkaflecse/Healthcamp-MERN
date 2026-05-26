import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { CiCircleMinus } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getteam,
  getTeamById,
  removemember,
} from "../../../../api/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../../api";

const EditTeam = () => {
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpen, { open: deleteModelOpen, close: deleteModelClose }] =
    useDisclosure(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  console.log(opened)
  const [selectedRemoveMember, setSelectedRemoveMember] = useState("");
  console.log(location, location.state);
  const { isLoading, data } = useQuery({
    queryKey: [`team${location?.state?.id}`],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(
          `${getTeamById}/${location.state.id}`,
          {}
        );
        return response.data;
      }
    },
  });
  const [updateData, setUpdateData] = useState({
    name: data && data?.name,
    description: data && data?.description,
  });
  useEffect(() => {
    setUpdateData({
      name: data && data?.name,
      description: data && data?.description,
    });
  }, [data]);


  

  const handleInfoUpdate = async () => {
    const respo = await axiosPrivateInstance.patch(
      `${getteam}/${data?.id}`,
      updateData,
      {}
    );
    return respo;
  };

  const { isPending, mutate: updateInfoMutate } = useMutation({
    mutationFn: handleInfoUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["team"],
        exact: true,
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["teamList"],
        exact: true,
        refetchType: "active",
      });
      navigate(`/team-list/${data?.id}`, { state: { showToast: true } });
      close();
    },
  
  });

  const handleRemove = (id: string) => {
    setSelectedRemoveMember(id);
    deleteModelOpen();
  };

  const handleRemoveMember = async () => {
    const resp = await axiosPrivateInstance.delete(removemember, {
      params: {
        adminId: selectedRemoveMember,
        teamId: data.id,
      },
    });
    return resp.data;
  };

  const { isPending: isRemovePending, mutate: removeMutate } = useMutation({
    mutationFn: () => handleRemoveMember(),
    mutationKey: ["removeTeamMember"],
    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({
        queryKey: ["team", location?.state?.id],
        refetchType: "active",
        exact: true,
      });
      navigate(`/team-list/${data.id}`, { state: { showToast: true } });
      close();
    },
    onError: () => {
      toast.error("Unable to delete member");
    },
  });

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Group mt={20} bg="primary.0" p={10} justify="center">
        <Text c="white" fw={500} p={8}>
          {data?.name}
        </Text>
      </Group>
      <Paper p={20}>
        <Group justify="center">
          <AiFillEdit color="blue" />
          <Title size="h4" c="primary.1" ta="center">
            Edit Team
          </Title>
        </Group>
        <Text ta="center" size="sm" c="dimmed">
          Fill all the below details for updating team
        </Text>
        <Text fw={500} c="primary.0">
          Team Name
        </Text>
        <TextInput
          value={updateData?.name}
          onChange={(e) =>
            setUpdateData((prev: any) => ({ ...prev, name: e.target.value }))
          }
          mt={5}
          placeholder="Provide Team Name"
        />
        <Text mt={20} fw={500} c="primary.0">
          Team Description
        </Text>
        <Textarea
          value={updateData?.description}
          onChange={(e) =>
            setUpdateData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          mt={5}
          placeholder="Provide Team Description"
        />
        <Text mt={20} fw={500} c="primary.0">
          Team Leader
        </Text>
        <Paper mt={5} withBorder p={10}>
          <Group justify="right">
            <Button
              onClick={() =>
                navigate("/member-add", {
                  state: {
                    role: "team_lead",
                    id: data.id,
                    members: data.admin.filter(
                      (item: any) => item.department === "team_lead"
                    ),
                  },
                })
              }
              rightSection={<IoMdAdd size={16} />}
            >
              Change Team Leader
            </Button>
          </Group>
          <Group p={20} justify="space-between">
            <Text>{data?.teamLeader?.name}</Text>
            <CiCircleMinus onClick={() => open()} color="red" size={20} />
          </Group>
        </Paper>

        <Text mt={20} fw={500} c="primary.0">
          Unit Cordinator
        </Text>
        <Paper mt={5} withBorder p={10}>
          <Group justify="right">
            <Button
              onClick={() =>
                navigate("/member-add", {
                  state: {
                    role: "unit_coordinator",
                    id: data.id,
                    members: data.admin.filter(
                      (item: any) => item.department === "unit_coordinator"
                    ),
                  },
                })
              }
              rightSection={<IoMdAdd size={16} />}
            >
              Add Unit Cordinator
            </Button>
          </Group>
          {data?.admin
            ?.filter((item: any) => item.department === "unit_coordinator")
            .map((item: any, index: any) => (
              <Paper key={index} withBorder mt={10}>
                <Group p={10} justify="space-between">
                  <Text>{item.name}</Text>
                  <CiCircleMinus
                    color="red"
                    size={20}
                    onClick={() => handleRemove(item.id)}
                  />
                </Group>
              </Paper>
            ))}
        </Paper>

        <Text mt={20} fw={500} c="primary.0">
          Data Entry
        </Text>
        <Paper mt={5} withBorder p={10}>
          <Group justify="right">
            <Button
              onClick={() =>
                navigate("/member-add", {
                  state: {
                    role: "data_entry",
                    id: data.id,
                    members: data.admin.filter(
                      (item: any) => item.department === "data_entry"
                    ),
                  },
                })
              }
              rightSection={<IoMdAdd size={16} />}
            >
              Add Data Leader
            </Button>
          </Group>
          {data?.admin
            ?.filter((item: any) => item.department === "data_entry")
            .map((item: any, index: any) => (
              <Paper key={index} withBorder mt={10}>
                <Group p={10} justify="space-between">
                  <Text>{item?.name}</Text>
                  <CiCircleMinus
                    color="red"
                    size={20}
                    onClick={() => handleRemove(item.id)}
                  />
                </Group>
              </Paper>
            ))}
        </Paper>

        <Center mt={20}>
          <Button
            bg="btncolor.0"
            onClick={() => updateInfoMutate()}
            loading={isPending}
          >
            {" "}
            Update
          </Button>
        </Center>
      </Paper>
      <Modal opened={deleteOpen} onClose={deleteModelClose}>
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
            loading={isRemovePending}
            onClick={() => removeMutate()}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default EditTeam;
