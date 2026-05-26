import {
  Alert,
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import {
  getAllServiceOfEventAPI,
  publishReportAPI,
  reportPublishAPI,
  updateReportStatusAPI,
} from "../../api/dataEntry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { toast } from "react-toastify";

const ServiceDetails = () => {
  const location = useLocation();
  const [participantDetails, setParticipantDetails] = useState();
  console.log(participantDetails);
  const [openedbro, { open: open1, close: close1 }] = useDisclosure(false);
  const eventId = location?.state?.id;
  const [opened, { open, close }] = useDisclosure(false);
  const [serviceId, setServiceId] = useState<string>();
  const navigate = useNavigate();
  const [visible, { toggle }] = useDisclosure(false);
  const [state, setState] = useState(false);
  const { reportState } = location?.state;
  console.log("reportstate", reportState);
  const queryClient = useQueryClient();

  const [tempState, setTempState] = useState<boolean>(false);

  const toogleState = (e: any) => {
    const newState = e?.target?.checked;
    setTempState(newState);
    open1();
  };

  useEffect(() => {
    setState(reportState === "true");
  }, []);

  const confirmToggleState = async () => {
    setState(tempState);
    close1();
    await updateReportStatusFunction();
  };

  const getAllServiceOfEvents = async () => {
    const resp = await axiosPrivateInstance.get(
      `${getAllServiceOfEventAPI}/${eventId}`
    );
    return resp.data;
  };

  const updateReportStatus = async () => {
    const resp = await axiosPrivateInstance.patch(
      `${updateReportStatusAPI}/${eventId}?status=${
        state ? "published" : "created"
      }`
    );
    return resp.data;
  };

  const onReportPublish = async () => {
    const resp = await axiosPrivateInstance.post(reportPublishAPI, {
      eventId,
      serviceId,
    });
    return resp.data;
  };

  const onPublishReport = async () => {
    const resp = await axiosPrivateInstance.post(publishReportAPI, {
      eventId,
      serviceId,
    });
    return resp.data;
  };

  const onReportSubmit = (serviceId: string) => {
    setServiceId(serviceId);
    toggle();
    mutate();
  };

  useEffect(() => {
    if (location.state && location.state.participantDetails) {
      setParticipantDetails(location.state.participantDetails);
    }
  }, [location.state]);

  const { data } = useQuery({
    queryKey: ["getAllServiceOfEventAPI"],
    queryFn: getAllServiceOfEvents,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: reportPublish } = useMutation({
    mutationKey: ["report-publish"],
    mutationFn: onPublishReport,
    onSuccess: () => {
      // navigate(`/find-student/`, { state: { eventId: eventId, serviceId } });
      toast.success("You can now start adding the report for this event");
      close();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["report-publish"],
    mutationFn: onReportPublish,
    onSuccess: (data) => {
      toggle();
      if (data.published == false) {
        open();
      } else {
        navigate(`/find-student/${data?.report}`, {
          state: { eventId: eventId, serviceId, reportId: data?.report },
        });
      }
    },
    onError: (err: any) => {
      toggle();
      toast.error(err);
    },
  });

  const { mutate: updateReportStatusFunction, isPending } = useMutation({
    mutationKey: ["update-report-status"],
    mutationFn: updateReportStatus,
    onSuccess: () => {
      toast.success("Report Status has been updated successfully!");
      navigate("/data-entry-dashboard");
      queryClient?.invalidateQueries({
        queryKey: [`to-assign-report/${reportState}`],
        exact: false,
      });
    },
  });

  return (
    <Paper p={20} withBorder>
      <Group justify="space-between">
        <Title size="h3" c="#6092FE">
          Service Details
        </Title>
        <Switch checked={state} onChange={toogleState} />
      </Group>

      <Modal opened={opened} onClose={close}>
        <Alert variant="light" color="blue" title="Add Report">
          Click on the button below to start adding report of participants for
          this event
        </Alert>

        <Button onClick={() => reportPublish()} my="md">
          Start
        </Button>
      </Modal>
      <Paper mt={20} p={20} withBorder>
        <Box pos="relative">
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Flex gap="md" direction="column">
            {data?.[0]?.bookingDate?.booking?.enrollPackage?.package?.service?.map(
              (serv: any) => (
                <Paper key={data?.[0]?.id} w="100%">
                  <Group p="xs" bg="blue" justify="space-between">
                    <Text fw="bold" c="white">
                      {serv?.name}
                    </Text>

                    <Button
                      onClick={() => onReportSubmit(serv?.id)}
                      disabled={reportState === "true"}
                      c="blue"
                      bg="white"
                    >
                      Entry
                    </Button>
                  </Group>

                  <Modal opened={openedbro} onClose={close1}>
                    <Text ta="center" fw="bold">
                      Are you ready to update report state?
                    </Text>
                    <Text ta="center" size="sm" mt="md">
                      By clicking 'Yes,' you will update the report status from
                      'Ongoing' to 'Completed' for this Event.
                    </Text>

                    <Group justify="center" mt="xl">
                      <Button
                        loading={isPending}
                        onClick={() => {
                          confirmToggleState();
                        }}
                        bg="red"
                      >
                        Yes
                      </Button>
                      <Button onClick={close1} bg="green">
                        No
                      </Button>
                    </Group>
                  </Modal>
                </Paper>
              )
            )}
          </Flex>
        </Box>
      </Paper>
    </Paper>
  );
};

export default ServiceDetails;
