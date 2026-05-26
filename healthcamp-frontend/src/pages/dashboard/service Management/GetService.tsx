import {
  Button,
  Center,
  Group,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaEdit, FaCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { CgDanger } from "react-icons/cg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { delService } from "../../../api/service";
import { axiosPrivateInstance } from "../../../api";
const Successful = () => {
  const navigate = useNavigate();
  // const [services, setServices] = useState<Service[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const queryClient = new QueryClient();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: location.state.name,
    description: location.state.description,
  });
  console.log(setFormData);

  useEffect(() => {
    if (
      location.state &&
      (location.state?.showUpdateToast === true ||
        location.state?.showToast === true)
    ) {
      toast.success("Service Updated Successfully !");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);
  const handleDelete = async () => {
    setButtonLoading(true);
    await axiosPrivateInstance.delete(`${delService}/${deleteId}`, {});
  };
  const deleteService = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceList"],
        refetchType: "active",
        exact: true,
      });
      navigate("/services");
      toast.error("Service deleted successfully!");
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

  return (
    <>
      <Title size="h2" c="primary.0">
        Service Management
      </Title>
      <Paper mt={10} p={20} withBorder>
      <Group justify="end">
          <Button
            ml={10}
            onClick={() =>
              navigate(`/booking-calendar/${location.state.id}`, {
                state: { hasCalender: location.state.hasCalender },
              })
            }
            variant="default"
          >
            Booking Calander
          </Button>
        </Group>
        <Center>
          <Paper radius={10} mt={10} p={10} withBorder>
            <Group gap={100}>
              <Text>{formData.name}</Text>
              <Group>
                <Modal opened={opened} onClose={close}>
                  <Center>
                    <CgDanger size={25} color="red" />
                  </Center>
                  <Text mt={10} fw={600} ta="center">
                    Are you sure you want to delete?
                  </Text>
                  <Text mt={10} maw={400} ta="center" c="textcolor.0" size="sm">
                    The action of deletion cannot be undone. Are you sure you
                    want to proceed deleting this service?
                  </Text>
                  <Group mt={20} justify="center">
                    <Button variant="default">Cancel</Button>
                    <Button
                      loading={buttonLoading}
                      onClick={() => deleteService.mutate()}
                      color="red"
                    >
                      Delete
                    </Button>
                  </Group>
                </Modal>
                <MdDelete
                  onClick={() => handleOpen(location.state.id)}
                  color="red"
                  size={25}
                />
                <FaEdit
                  onClick={() =>
                    navigate("/editservice", { state: { ...location.state } })
                  }
                  color="blue"
                  size={25}
                />
              </Group>
            </Group>
            <Text mt={10} c="textcolor.0" size="sm" maw={300}>
              {formData.description}
            </Text>
            {location.state.attributes.map((item: any, index: any) => {
              return (
                <Group key={index} mt={10} gap={5}>
                  <FaCircle color="6092FE" />
                  <Text c="textcolor.0">{item.name}</Text>
                </Group>
              );
            })}
          </Paper>
        </Center>

        

        <Center mt={20}>
          <Button onClick={() => navigate("/services")} variant="default">
            View All Services
          </Button>
          <Button
            ml={10}
            onClick={() =>
              navigate(`/calendar/${location.state.id}`, {
                state: { hasCalender: location.state.hasCalender },
              })
            }
            variant="filled"
          >
            View Calendar
          </Button>
        </Center>
      </Paper>
    </>
  );
};

export default Successful;
