import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { getAttributesServiceAPI, postAttributeAPI } from "../../api/dataEntry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const ParticipantDetails = () => {
  const location = useLocation();
  const participantDet = location.state?.participantDetails;
  const serviceId = location?.state?.serviceId;
  const [values, setValues] = useState<Record<string, string>>({});
  const { reportId } = useParams();
  console.log(reportId);

  const eventId = location?.state?.eventId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getServiceAttributes = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getAttributesServiceAPI}/${serviceId}`
    );

    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["get-attributes-service"],
    queryFn: getServiceAttributes,
  });

  const handleInputChange = (name: any, value: any) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const report = data?.attributes.map((att: any) => ({
    value: values[att.name] || "",
    reportId,
    attributeId: att.id,
    participantId: participantDet?.id,
  }));

  const postParticipantAttributes = async () => {
    const resp = await axiosPrivateInstance.post(
      `${postAttributeAPI}/${reportId}`,
      { report }
    );
    return resp.data;
  };

  const { mutate } = useMutation({
    mutationKey: ["post-attributes"],
    mutationFn: postParticipantAttributes,
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSuccess: () => {
      toast.success("Paricipant attributes has been published successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-reports-of-participants", eventId, serviceId],
      });
      navigate(`/find-student/${reportId}`, {
        state: {
          serviceId,
          eventId,
          reportId,
          participantIdd: participantDet?.id,
        },
      });
    },
  });

  const handlePost = () => {
    const isEmpty = data?.attributes.some(
      (att: any) => !values[att.name] || values[att.name].trim() === ""
    );

    if (isEmpty) {
      toast.error("Please enter all attribute values.");
      return;
    }

    mutate();
  };

  return (
    <Box>
      <Paper p={20} withBorder>
        <Center>
          <Image src={"img/client.png"} w={100} h={100} radius="50%" />
        </Center>
        <Flex gap="xs" direction="column">
          <Text fw={500} c="#6092FE" ta="center">
            Participant ID : {participantDet?.participantId}
          </Text>
          <Text fw={500} ta="center">
            {participantDet?.name}
          </Text>
          <Text fw={500} ta="center" c="dimmed">
            {participantDet?.email}
          </Text>
          <Text fw={500} ta="center" c="dimmed">
            {participantDet?.address}
          </Text>
        </Flex>
      </Paper>

      <Paper withBorder p="xl" mt="xl">
        <Text ta="center" size="xl" fw="bold">
          Report Details
        </Text>

        <Box my="xs">
          <Flex direction="column" gap="sm">
            {data?.attributes?.map((att: any) => (
              <Group gap="xl" style={{ width: "90%" }}>
                <Flex direction="column">
                  <label>{att?.name}</label>
                </Flex>

                <Flex direction="column">
                  <TextInput
                    style={{ width: "90%" }}
                    value={values[att.name] || ""}
                    onChange={(e) =>
                      handleInputChange(att.name, e.target.value)
                    }
                  />
                </Flex>
              </Group>
            ))}
          </Flex>

          <Button onClick={handlePost} bg="blue" my="xl">
            Post
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ParticipantDetails;
