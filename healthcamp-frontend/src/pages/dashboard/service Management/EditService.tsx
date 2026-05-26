import {
  Button,
  Center,
  Group,
  Input,
  Modal,
  Paper,
  Table,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { CgDanger } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttribute, updateService } from "../../../api/service";
import { toast } from "react-toastify";
import { TiDelete } from "react-icons/ti";
import { axiosPrivateInstance } from "../../../api";

const EditService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [attributes, setAttribute] = useState<string[]>([""]);
  const [attributesValue, setAttributeValue] = useState<string[]>([]);

  const [formDta, setFormDta] = useState({
    name: location.state?.name,
    description: location.state?.description,
  });
  const rows = location.state?.attributes.map(
    (element: { name: string; id: string }, index: number) => (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>
          {
            <MdDelete
              size={22}
              color="red"
              onClick={() => handleOpen(element.id)}
            />
          }
        </Table.Td>
      </Table.Tr>
    )
  );
  const handleDelete = async () => {
    await axiosPrivateInstance.delete(`${deleteAttribute}/${deleteId}`, {});
  };

  const { mutate: deleteMutate, isPending: buttonLoading } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceList"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Service attribute deleted successfully");
      navigate("/services");
      close();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleQualificationChange = (index: number, value: string) => {
    const newQualifications = [...attributesValue];
    newQualifications[index] = value;
    setAttributeValue(newQualifications);
  };

  const handleEdit = async () => {
    let body;
    body = { ...formDta };
    if (attributesValue.length > 0) {
      body = { ...formDta, attributes: attributesValue };
    }
    const resp = await axiosPrivateInstance.patch(
      `${updateService}/${location.state.id}`,
      body,
      {}
    );
    return resp.data;
  };

  const { mutate: updateMutate, isPending: EditButtonPending } = useMutation({
    mutationFn: handleEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceList"],
        refetchType: "active",
        exact: true,
      });
      toast.success("Service has been updated successfully");
      navigate("/services");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleOpen = (id: string) => {
    open();
    setDeleteId(id);
  };

  return (
    <>
      <Title size="h2" c="primary.0">
        Service Management
      </Title>
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
          <Button
            loading={buttonLoading}
            onClick={() => deleteMutate()}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
      <Paper mt={10} withBorder>
        <Table mt={10} bg="white">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SN</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <Paper withBorder p={20} mt={20}>
        <Group justify="center">
          <Title c="primary.1" size="h4">
            Edit Service
          </Title>
          <FaEdit color="blue" size={25} />
        </Group>
        <Text mt={10} c="#878787" ta="center">
          Fill all the below details for creating a new service.
        </Text>
        <Text mt={10} c="primary.0" fw={700}>
          Service Title
        </Text>
        <Input
          value={formDta.name}
          onChange={(e) =>
            setFormDta((prev) => ({ ...prev, name: e.target.value }))
          }
          mt={10}
          placeholder="Provide a title for your new service"
        />
        <Text mt={10} c="primary.0" fw={700}>
          Service Description
        </Text>
        <Textarea
          value={formDta.description}
          onChange={(e) =>
            setFormDta((prev) => ({ ...prev, description: e.target.value }))
          }
          mt={10}
          placeholder="Provide a short description of your service"
        />

        <Text mt={10} c="primary.0" fw={700}>
          Add Attribute
        </Text>
        <Paper mt={10} withBorder p={10}>
          <Text c="textcolor.0" mt={10}>
            Add your service attributes
          </Text>

          {attributes.map((_qualifcation, index) => (
            <React.Fragment key={index}>
              <Text size="sm" c="textcolor.0" mt={10}>
                Attribute {index + 1}{" "}
                <TiDelete
                  color="red"
                  size={20}
                  onClick={() =>
                    setAttribute((prev) => {
                      const newAttributes = [...prev];
                      newAttributes.splice(index, 1);
                      return newAttributes;
                    })
                  }
                />
              </Text>
              <Input
                onChange={(e) =>
                  handleQualificationChange(index, e.target.value)
                }
                mt={10}
                placeholder="Enter Your First Attribute"
              />
            </React.Fragment>
          ))}

          <Button
            variant="default"
            mt={10}
            rightSection={<IoMdAdd />}
            onClick={() => setAttribute((prev) => [...prev, ""])}
          >
            Add More
          </Button>
        </Paper>
        <Center>
          <Button
            onClick={() => updateMutate()}
            mt={20}
            bg="btncolor.1"
            loading={EditButtonPending}
          >
            Update
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default EditService;
