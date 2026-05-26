import {
  Button,
  Center,
  Group,
  List,
  Modal,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteprice } from "../../../api/package";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";

const GetPackage = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async () => {
    setButtonLoading(true);
    await axiosPrivateInstance.delete(`${deleteprice}/${deleteId}`, {});
  };
  const deletePrice = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packageList"] });
      toast.success("Package deleted successfully!");
      navigate("/package");
      close();
    },
    onSettled: () => {
      setButtonLoading(false); // ensure loading is reset no matter success/failure
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error deleting package");
    },
  });

  const handleOpen = (id: number) => {
    open();
    setDeleteId(id);
  };

  return (
    <>
      <Title size="h2" c="#6092FE">
        Package Management
      </Title>
      <Paper mt={20} p={20} withBorder>
        <Title size="h4">{location.state.name}</Title>

        <Text mt={5}> {location.state.description}</Text>
        <Table mt={10} bg="white">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Min</Table.Th>
              <Table.Th>Max</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Modal opened={opened} onClose={close}>
            <Center>
              <CgDanger size={25} color="red" />
            </Center>
            <Text mt={10} fw={600} ta="center">
              Are you sure you want to delete?
            </Text>
            <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
              The action of deletion cannot be undone. Are you sure you want to
              proceed deleting this price?
            </Text>
            <Group mt={20} justify="center">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button
                loading={buttonLoading}
                onClick={() => {
                  setButtonLoading(true);
                  deletePrice.mutate();
                }}
                color="red"
              >
                Delete
              </Button>
            </Group>
          </Modal>
          {location?.state?.price?.map((item: any, index: any) => {
            return (
              <React.Fragment key={index}>
                <Table.Tbody>
                  <Table.Tr key={index}>
                    <Table.Td>{item.min}</Table.Td>
                    <Table.Td>{item.max}</Table.Td>
                    <Table.Td>{item.price}</Table.Td>
                    <Table.Td>
                      <MdDelete
                        onClick={() => handleOpen(item.id)}
                        color="red"
                        size={20}
                      />
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </React.Fragment>
            );
          })}
        </Table>
        <Title order={5}>Services:</Title>
        {location.state.service?.map((item: any, index: any) => {
          return (
            <List key={index} icon={<IoIosArrowForward />}>
              <List.Item>{item.name}</List.Item>
            </List>
          );
        })}
      </Paper>
      {/* );
      })} */}
    </>
  );
};

export default GetPackage;
