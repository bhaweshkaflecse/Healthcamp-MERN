import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Modal,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAdminAPI, getbydepartment } from "../../../api/role";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { CgDanger } from "react-icons/cg";
import { axiosPrivateInstance } from "../../../api";

const TeamLead = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const { id } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: [`memberList}/${id}`],
    queryFn: async () => {
      {
        const response = await axiosPrivateInstance.get(getbydepartment, {
          params: {
            dept: id,
          },
        });
        return response.data;
      }
    },
  });
  console.log(data);

  const handleDelete = async () => {
    setButtonLoading(true);
    await axiosPrivateInstance.delete(`${deleteAdminAPI}/${deleteId}`, {});
  };
  const deleteadmin = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memberList"],
        refetchType: "active",
        exact: true,
      });

      toast.success("User deleted successfully!");
      navigate("/role");
      close();
    },
    onMutate: () => {
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
  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper withBorder p={10} mt={10}>
        <Title size="h3">{id}</Title>
        <Group mt={40} gap={20}>
          {data?.map((detail: any, index: any) => (
            <Paper key={index} withBorder>
              <Flex
                w="auto"
                maw="300px"
                m={16}
                align="center"
                wrap="wrap"
                direction={"column"}
              >
                <Flex justify="flex-end" w="100%">
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <Button c="black" bg="none">
                        <BsThreeDotsVertical size={20} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        fw={600}
                        onClick={() =>
                          navigate(`/view-teamLeadMembers/${detail.id}`, {
                            state: { id: detail.id },
                          })
                        }
                      >
                        View Team
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          navigate("/updateadmin", { state: detail })
                        }
                      >
                        Edit Role
                      </Menu.Item>
                      <Menu.Item onClick={() => handleOpen(detail.id)} c="red">
                        Remove User
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
                <Image
                  radius={80}
                  w={100}
                  src={detail.profile || "/admin/img/imagenotfound.png"}
                />
                <Text fw={650}>{detail.name}</Text>
                <Text>{detail.email}</Text>
              </Flex>
            </Paper>
          ))}
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
            <Button
              loading={buttonLoading}
              onClick={() => deleteadmin.mutate()}
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

export default TeamLead;
