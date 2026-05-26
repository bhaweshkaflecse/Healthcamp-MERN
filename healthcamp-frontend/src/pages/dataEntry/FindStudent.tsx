import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteResultAPI,
  getAllParticipantsOfReportAPI,
  getIfParticipantsExistsAPI,
  publishReportToTeamLead,
  // getReportOfIndividualParticipantAPI,
} from "../../api/dataEntry";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";

const FindStudent = () => {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState<string>("");
  const [partiId, setPartiId] = useState();
  const [error, setError] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  const [eventId, setEventId] = useState("");
  const location = useLocation();

  const { serviceId } = location.state;
  const { reportId } = location.state;
  const queryClient = useQueryClient();

  const getAllParticipantsOfReport = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getAllParticipantsOfReportAPI}?eventId=${eventId}&serviceId=${serviceId}`
    );

    return resp.data;
  };

  const onResultClick = (id: any) => {
    setPartiId(id);
  };
  const deleteResult = async () => {
    const resp = await axiosPrivateInstance.delete(`${deleteResultAPI}`, {
      data: {
        participantId: partiId,
        reportId,
      },
    });
    return resp.data;
  };

  const { mutate: deleteResultFun } = useMutation({
    mutationKey: ["delte-result"],
    mutationFn: deleteResult,
    onSuccess: () => {
      toast.success("Result has been deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-reports-of-participants", eventId, serviceId],
        exact: true,
      });
      close();
    },
  });

  const { data } = useQuery({
    queryKey: ["get-all-reports-of-participants", eventId, serviceId],
    queryFn: getAllParticipantsOfReport,
  });

  function Demo() {
    const rows = data?.map((details: any) => (
      <Table.Tr key={details?.id}>
        <Table.Td>{details?.id}</Table.Td>
        <Table.Td>{details?.name}</Table.Td>
        <Table.Td>{details?.gender}</Table.Td>
        <Table.Td>{details?.grade}</Table.Td>
        <Table.Td>
          <Group>
            <MdDelete
              onClick={() => {
                open(), onResultClick(details?.id);
              }}
              color="red"
            />
            <MdEdit
              onClick={() =>
                navigate(`/edit-attributes/${reportId}`, {
                  state: { details, reportId, eventId },
                })
              }
            />
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Participant Id</Table.Th>
            <Table.Th>Participant Name</Table.Th>
            <Table.Th>Gender</Table.Th>
            <Table.Th>Class</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  }

  useEffect(() => {
    if (location.state && location.state.eventId) {
      setEventId(location.state.eventId);
    } else {
      <Text c="yellow">Event id is not defined</Text>;
    }
  }, []);

  const onGetIfParticipantsExists = async () => {
    const res = await axiosPrivateInstance.post(getIfParticipantsExistsAPI, {
      participantId,
      eventId,
    });

    return res.data;
  };

  const { mutate } = useMutation({
    mutationKey: ["get-if-participants-exists"],
    mutationFn: onGetIfParticipantsExists,
    onError: (err: any) => {
      err?.response?.data?.message?.map((er: any) => toast.error(er));
    },
    onSuccess: (data) => {
      // setParticipantDetails(res)
      if (!data) {
        toast.error("Participant not found");
        return;
      }

      navigate(`/participant-details/${reportId}`, {
        state: {
          participantDetails: data,
          eventId: eventId,
          serviceId,
          reportId,
        },
      });
    },
  });

  const handleSearch = () => {
    if (participantId.trim() === "") {
      setError("Please Enter Id");
      return;
    } else {
      setError("");
      mutate();
    }
  };
  const onPublishReport = async () => {
    const resp = await axiosPrivateInstance.post(
      `${publishReportToTeamLead}/${reportId}`
    );
    return resp.data;
  };

  const { mutate: publishReport, isPending } = useMutation({
    mutationKey: ["publish-report"],
    mutationFn: onPublishReport,
    onSuccess: () => {
      toast.success("Report has been published successfully!");
      // navigate(`/find-student/${reportId}`, {
      //   state: { eventId: eventId, serviceId, reportId },
      // });

    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  return (
    <Box>
      <Paper p={20} withBorder>
        <Group justify="space-between">
          <Title size="h3" c="#6092FE">
            Enter Participant Id
          </Title>
          <Button
            variant="default"
            onClick={() => publishReport()}
            loading={isPending}
          >
            Publish Report
          </Button>
        </Group>
        <TextInput
          autoFocus
          value={participantId}
          error={error}
          onChange={(e) => {
            setParticipantId(e.target.value);
            if (e.target.value.trim() !== "") {
              setError("");
            }
          }}
          mt={10}
          placeholder="Search..."
          w={"100%"}
        />
        <Button onClick={handleSearch} mt={10}>
          Search
        </Button>
      </Paper>

      <Modal opened={opened} onClose={close}>
        <Text ta="center" fw="bold">
          Are you sure want to delete?
        </Text>

        <Group mt="xl">
          <Button bg="red" onClick={() => deleteResultFun()}>
            Yes
          </Button>
          <Button onClick={close} bg="green">
            No
          </Button>
        </Group>
      </Modal>

      <Paper mt="xl">
        <Demo />
      </Paper>
    </Box>
  );
};

export default FindStudent;
