import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  NumberInput,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  assignCalendar,
  getAssignedCalendar,
  updateCalendarapi,
} from "../../../api/calender";
import { axiosPrivateInstance } from "../../../api";

const SetCalendar = () => {
  const { id } = useParams();

  const location = useLocation();
  const serviceId = location.state.serviceId;
  const enrollId = location.state.enrollId;
  const serviceName = location.state.serviceName;
  const profile = location.state.profile;
  console.log(profile, "profile");
  console.log(serviceId, enrollId);
  const queryClient = useQueryClient();
  const [valueFrom, setValueFrom] = useState<Date | null>(null);
  const [valueTo, setValueTo] = useState<Date | null>(null);
  const [slotValue, setSlotChange] = useState<string | number>("");
  const [isDisable, _setIsDisable] = useState(true);

  const {
    data: assignData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`CalendarUpdate/${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getAssignedCalendar, {
        params: {
          clientId: id,
          serviceId,
          enrollId,
        },
      });
      return response.data;
    },
    staleTime: 0,
  });
  console.log(assignData);

  console.log(assignData, "assignData");
  const handleSubmit = async () => {
    try {
      const body = {
        startDate: valueFrom,
        endDate: valueTo,
        isDisable: isDisable,
        slot: +slotValue,
        serviceId: serviceId,
        clientId: id,
        enrollId: enrollId,
      };
      console.log(body);
      const resp = await axiosPrivateInstance.post(`${assignCalendar}`, body);
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!assignData) {
      setValueFrom(null);
      setValueTo(null);
      setSlotChange("");
    } else {
      setValueFrom(new Date(assignData.startDate));
      setValueTo(new Date(assignData.endDate));
      setSlotChange(assignData.slot);
    }
  }, [assignData]);

  const { isPending, mutate: mutateAssignCalendar } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`assignCalendar${id}`],
        refetchType: "active",
        exact: true,
      });
      toast.success("Assigned Calendar successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateCalendar = async () => {
    try {
      const body = {
        startDate: valueFrom,
        endDate: valueTo,
        isDisable: isDisable,
        slot: +slotValue,
        serviceId: serviceId,
        clientId: id,
      };
      const resp = await axiosPrivateInstance.patch(
        `${updateCalendarapi}/${assignData?.id}`,
        body
      );
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { mutate: mutateupdateCalendar } = useMutation({
    mutationFn: updateCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`updateCalendar${id}`],
        refetchType: "active",
        exact: true,
      });
      toast.success("Assigned Calendar successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box>
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (error) {
    return (
      <Alert variant="light" color="red" title="Error Occurred">
        {/* @ts-ignore */}
        {error?.response?.data?.message || "Error Occurred"}
      </Alert>
    );
  }
  return (
    <>
      <Title size="h2" c="primary.0">
        Calendar
      </Title>
      <Paper p={20} mt={10} withBorder>
        <Title size="h3" c="primary.1">
          Service: {serviceName}
        </Title>
        <Flex gap={0} align="center">
          <Image radius={'50%'} w={50} src={profile||"/img/calendar.png" }/>
          <Text ml={5}>
            You can now send calendars to clients who have enrolled in this
            service. Below is a list of these clients. By clicking on them, you
            can send the calendar directly to each individual. This feature
            streamlines the process of sharing calendars with enrolled clients.
          </Text>
        </Flex>
        <Group>
          <MdGroup size={20} />
          <Box>
            <Text>No. of Participants</Text>
            <Text size="sm" c="dimmed">
              {assignData?.clients?.length}
            </Text>
          </Box>
        </Group>
        <Text mt={20} fw={500}>
          Select Months to be Opened
        </Text>

        <Group>
          <Box mt={20}>
            <Text fw={500}>From</Text>
            <DateInput
              value={valueFrom}
              onChange={setValueFrom}
              placeholder="Pick the Start Date"
            />
          </Box>
          <Box>
            <Text mt={10} fw={500}>
              To
            </Text>
            <DateInput
              value={valueTo}
              onChange={setValueTo}
              placeholder="Pick the End Date"
            />
          </Box>
        </Group>
        <Box mt={20}>
          <Text fw={500}>No. of Slots</Text>
          <NumberInput value={slotValue} onChange={setSlotChange} />
        </Box>
        {!assignData ? (
          <Button
            onClick={() => mutateAssignCalendar()}
            loading={isPending}
            mt={20}
            rightSection={<FaCalendarAlt />}
            bg="btncolor.1"
          >
            Send Calendar
          </Button>
        ) : (
          <Button
            onClick={() => mutateupdateCalendar()}
            mt={20}
            bg="btncolor.1"
          >
            Update Calendar
          </Button>
        )}
      </Paper>
    </>
  );
};

export default SetCalendar;
