import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Modal,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import {
  getReportOfIndividualParticipantAPI,
  updateReportAPI,
} from "../../api/dataEntry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorAxios from "../../components/sidebar/ErrorAxios";

const EditAttributes = () => {
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [attValue, setAttValue] = useState([]);
  const [resultId, setResultId] = useState();
  const [newValue, setNewValue] = useState();

  const { details } = location?.state;

  const { reportId } = location?.state;
  const participantId = details?.id;
  const queryClient = useQueryClient();
  // const {eventId} = location?.state

  //   const handleChange = (name, value) =>{

  //     setAttValue

  //   }

  const viewParticipantDetails = async () => {
    const res = await axiosPrivateInstance.get(
      `${getReportOfIndividualParticipantAPI}?reportId=${reportId}&participantId=${participantId}`
    );

    return res?.data;
  };

  const handleEdit = (att: any) => {
    console.log(att?.id);
    setResultId(att?.id);
    setNewValue(att?.value);
    open();
  };

  const onEditAttributesValue = async () => {
    const res = await axiosPrivateInstance.patch(
      `${updateReportAPI}/${resultId}`,
      {
        value: newValue,
      }
    );

    return res.data;
  };

  console.log("my att value", attValue);

  const { mutate } = useMutation({
    mutationKey: ["update-attributes"],
    mutationFn: onEditAttributesValue,
    onSuccess: () => {
      toast.success("Attribute has updated successfully!");
      close();
      queryClient?.invalidateQueries({
        queryKey: ["view-individual-participants", participantId],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const { data, error } = useQuery({
    queryKey: ["view-individual-participants", participantId],
    queryFn: viewParticipantDetails,
  });

  useEffect(() => {
    if (data) {
      setAttValue(data);
    }
  }, [data]);

  const handleChange = (attributeId: any, newValue: any) => {
    setAttValue((prevValue: any) =>
      prevValue.map((item: any) =>
        item.attribute.id === attributeId ? { ...item, value: newValue } : item
      )
    );
  };

  if (error) {
    return <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  return (
    <Box>
      <Paper p={20} withBorder>
        <Center>
          <Image src={"img/client.png"} w={100} h={100} radius="50%" />
        </Center>
        <Flex gap="xs" direction="column">
          <Text fw={500} c="#6092FE" ta="center">
            Participant ID :{participantId}
          </Text>
          <Text fw={500} ta="center">
            {details?.name}
          </Text>
          <Text fw={500} ta="center" c="dimmed">
            {details?.email}
          </Text>
          <Text fw={500} ta="center" c="dimmed">
            {details?.address}
          </Text>
        </Flex>
      </Paper>

      <Modal opened={opened} onClose={close}>
        <Text ta="center" fw="bold">
          Are you sure want to edit?
        </Text>

        <Group mt="xl">
          <Button onClick={() => mutate()} bg="red">
            Yes
          </Button>
          <Button onClick={close} bg="green">
            No
          </Button>
        </Group>
      </Modal>

      <Paper mt="xl" p="xl">
        <Flex direction="column" gap="md">
          {attValue &&
            attValue?.map((att: any) => (
              <Group key={att?.attribute?.id}>
                <label>{att?.attribute?.name}</label>
                <TextInput
                  value={att?.value}
                  w={"60%"}
                  onChange={(e) =>
                    handleChange(att.attribute.id, e.target.value)
                  }
                />
                <Button onClick={() => handleEdit(att)}>Edit</Button>
              </Group>
            ))}
        </Flex>
      </Paper>
    </Box>
  );
};

export default EditAttributes;
