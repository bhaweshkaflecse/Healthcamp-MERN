import {
  Button,
  Center,
  Flex,
  NumberInput,
  Paper,
  Space,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { roledata } from "../rough/Rough";
import { updateAdmnAPI } from "../../../api/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";

const UpdateAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [checkedRole, setCheckedRole] = useState({
    [location.state.department]: true,
  });
  const [formData, setformData] = useState({
    name: location.state.name,
    contact: +location.state.contact,
    address: location.state.address,
  });

  const handleEdit = async () => {
    let body = { ...formData, department: Object.keys(checkedRole)[0] };
    console.log(body);
    const resp = await axiosPrivateInstance.patch(
      `${updateAdmnAPI}/${location.state.id}`,
      body,
      {}
    );
    return resp.data;
  };

  const { mutate: updateMutate, isPending: EditButtonPending } = useMutation({
    mutationFn: handleEdit,
    onSuccess: () => {
      navigate("/role");
      toast.success("Data updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["memberList"],
        refetchType: "active",
        exact: true,
      });
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
      <Paper mt={10} p={18} withBorder lh={2.5}>
        <Title size="h4">Assign Staff</Title>
        <Text mt={20} fw={500} ta="center">
          Select the role you are assigning for your member
        </Text>
        <Center>
          <Paper mt={10} w={450} p={20} withBorder>
            {roledata.map((item: any) => {
              return (
                <Flex key={item.id} justify="space-between">
                  <p>{item.name}</p>
                  <Switch
                    checked={checkedRole[item.value] ? true : false}
                    onChange={(e) =>
                      setCheckedRole({
                        [item.value]: e.target.checked,
                      })
                    }
                  />
                </Flex>
              );
            })}
          </Paper>
        </Center>
      </Paper>
      <Paper p={10} withBorder mt={10} lh={2.5}>
        <Space h={"lg"} />
        <Paper p={18} withBorder lh={2.5}>
          <Flex direction="column" gap={20}>
            <Title size="h4">Team Lead Info</Title>
            <TextInput
              onChange={(e) =>
                setformData((prev) => ({ ...prev, name: e.target.value }))
              }
              value={formData.name}
              withAsterisk
              placeholder="First Name *  "
            />
            <NumberInput
              onChange={(e) =>
                setformData((prev) => ({ ...prev, contact: +e }))
              }
              value={formData.contact}
              placeholder="Phone Nummber *"
            />
            <TextInput
              onChange={(e) =>
                setformData((prev) => ({ ...prev, address: e.target.value }))
              }
              value={formData.address}
              placeholder="Address *"
            />
          </Flex>
        </Paper>
        <Space h="lg" />
        <Flex justify={"center"} gap={10}>
          <Button
            color="green"
            loading={EditButtonPending}
            onClick={() => updateMutate()}
          >
            Update
          </Button>
        </Flex>
      </Paper>
    </>
  );
};

export default UpdateAdmin;
