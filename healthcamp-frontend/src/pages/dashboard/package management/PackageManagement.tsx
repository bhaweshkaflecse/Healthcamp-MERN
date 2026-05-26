import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { deletepackage, getpackage } from "../../../api/package";
import { useDisclosure } from "@mantine/hooks";
import { CgDanger } from "react-icons/cg";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorAxios from "../../../components/sidebar/ErrorAxios";
import { axiosPrivateInstance } from "../../../api";

const PackageManagement = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    isLoading,
    data,
    error: errorToGet,
  } = useQuery({
    queryKey: ["packagList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getpackage, {});
      return response.data;
    },
  });
  console.log(data)

  const handleDelete = async () => {
    setButtonLoading(true);
    await axiosPrivateInstance.delete(`${deletepackage}/${deleteId}`, {});
  };

  const { mutate: deletePackage } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packagList"],
        refetchType: "active",
        exact: true,
      });
      close();
      toast.success("Deleted Package successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
    onSettled: () => {
      setButtonLoading(false);
    },
  });

  const handleOpen = (id: number) => {
    open();
    setDeleteId(id);
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

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (errorToGet) {
    return (
      <ErrorAxios
        error={errorToGet}
        fallbackMessage="Failed to load services"
      />
    );
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Package Management
      </Title>
      <Paper mt={10} p={20}>
        <Group justify="space-between">
          <Title c="primary.1" size="h4">
            {" "}
            PACKAGES
          </Title>
          <Button
            onClick={() => navigate("/create-package")}
            leftSection={<IoMdAdd size={16} />}
            bg="btncolor.1"
          >
            Create New Package
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
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              loading={buttonLoading}
              onClick={() => deletePackage()}
              color="red"
            >
              Delete
            </Button>
          </Group>
        </Modal>
        {!data?.packages?.length && <Center>No data found</Center>}

        {data?.packages?.map((item: any, index: any) => {
          return (
            <Paper key={index} withBorder p={20} mt={20}>
              <Group w="100%" justify="space-between">
                <Group>
                  <Image
                    radius="50%"
                    w={50}
                    h={50}
                    src={item.img ? item.img : "/img/imagenotfound.png"}
                  />
                  <Box>
                    <Text>{item.name}</Text>
                    <Text maw={600} c="dimmed" size="sm">
                      {item.description}
                    </Text>
                    <Button
                      onClick={() =>
                        navigate(`/package/${item.id}`, {
                          state: item,
                        })
                      }
                      mt={10}
                      variant="default"
                    >
                      View Details
                    </Button>
                  </Box>
                </Group>
                <Group>
                  <MdDelete
                    onClick={() => handleOpen(item.id)}
                    color="red"
                    size={25}
                  />
                  <AiFillEdit
                    onClick={() => navigate(`/editpackage/${item.id}`)}
                    color="green"
                    size={25}
                  />
                </Group>
              </Group>
            </Paper>
          );
        })}
      </Paper>
    </>
  );
};

export default PackageManagement;
