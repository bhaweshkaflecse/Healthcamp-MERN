import {
  Button,
  Center,
  Group,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { createteam } from "../../../../api/team";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../../api";

const CreateTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: location.state?.name || "",
    description: location.state?.description || "",
    teamleader: location.state?.teamleader,
    unitCordinator: location.state?.unitCordinator || null,
    dataEntry: location.state?.dataEntry,
  });
  const handleSubmit = async () => {
    const memberIds = [
      ...(formData.unitCordinator.map((item: any) => item.id) || null),
      ...formData.dataEntry.map((item1: any) => item1.id),
    ];

    const body = {
      name: formData.name,
      description: formData.description,
      teamLeaderId: formData.teamleader[0].id,
      memberIds: memberIds,
    };

    try {
      const resp = await axiosPrivateInstance.post(createteam, body, {});
      return resp.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { isPending, mutate: mutateCreateTeam } = useMutation({
    mutationFn: () => handleSubmit(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamList"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Created Team successfully");
      navigate("/role");
    },

    onError: (error: any) => {
      console.error("Error:", error);
    },
  });

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>

      <Paper mt={20} p={20}>
        <Title size="h4" c="primary.1" ta="center">
          Create New Team
        </Title>
        <Text ta="center" size="sm" c="dimmed">
          Fill all the below details for creating a new team
        </Text>
        <Text fw={500} c="primary.0">
          Team Name
        </Text>
        <TextInput
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          mt={5}
          placeholder="Provide Team Name"
        />
        <Text mt={20} fw={500} c="primary.0">
          Team Description
        </Text>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
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
              onClick={() => navigate("/team-leader", { state: formData })}
              rightSection={<IoMdAdd size={16} />}
            >
              Add Team Leader
            </Button>
          </Group>
          {formData.teamleader?.map((item: any, index: any) => {
            return <Text key={index}>{item.name}</Text>;
          })}
        </Paper>
        <Text mt={20} fw={500} c="primary.0">
          Unit Cordinator
        </Text>
        <Paper mt={5} withBorder p={10}>
          <Group justify="right">
            <Button
              onClick={() => navigate("/unit-leader", { state: formData })}
              rightSection={<IoMdAdd size={16} />}
            >
              Add Unit Leader
            </Button>
          </Group>
          {formData.unitCordinator?.map((item1: any, index1: any) => {
            return <Text key={index1}>{item1.name}</Text>;
          })}
        </Paper>
        <Text mt={20} fw={500} c="primary.0">
          Data Entry
        </Text>
        <Paper mt={5} withBorder p={10}>
          <Group justify="right">
            <Button
              onClick={() => navigate("/data-leader", { state: formData })}
              rightSection={<IoMdAdd size={16} />}
            >
              Add Data Leader
            </Button>
          </Group>
          {formData.dataEntry?.map((item2: any, index2: any) => {
            return <Text key={index2}>{item2.name}</Text>;
          })}
        </Paper>
        <Center mt={20}>
          <Button
            bg="btncolor.0"
            loading={isPending}
            onClick={() => mutateCreateTeam()}
          >
            Create
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default CreateTeam;
