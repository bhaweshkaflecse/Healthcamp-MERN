import {
  Box,
  Button,
  Fieldset,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { postBookingAPI } from "../../api/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Form = () => {
  const location = useLocation();
  const [slots, setSlots] = useState<any[]>([]);
  const { selectedSlots, data: calenderdates } = location.state;
  const enrollPackageId = location.state?.enrollPackageId;
  const navigate = useNavigate();

  const bookingDates = slots.map((hero) => hero?.sdate);
  const queryClient = useQueryClient();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      venue: "",
    },
    validate: {
      venue: (value) => (value ? null : "Please enter the venue"),
    },
  });

  const postBooking = async (values: any) => {
    const required = {
      serviceCalendarId: calenderdates[0]?.id,
      ...values,
      bookingDates,
      enrollPackageId,
      eventCalendarId: calenderdates[0]?.eventCalendarId,
    };

    const resp = await axiosPrivateInstance.post(postBookingAPI, required);
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["postBooking"],
    mutationFn: postBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getBookedEvents"],
        exact: true,
        refetchType: "active",
      });

      navigate("/dashboard");

      toast.success("Event Booked Successfully");
    },
    onError: (error: any) => {
      const errMessage = error?.response?.data?.message;

      if (Array.isArray(errMessage)) {
        errMessage.forEach((msg) => toast.error(msg));
      }

      toast.error(errMessage);
    },
  });

  const handleSubmit = (formValues: any) => {
    mutate(formValues);
  };

  useEffect(() => {
    if (selectedSlots) {
      setSlots(Array.from(selectedSlots));
    }
  }, [selectedSlots]);

  return (
    <Box>
      <Paper withBorder p={40}>
        <Title size={20} ta="center" c="blue">
          Book Event
        </Title>
        <Text my={10} ta="center" c="dimmed">
          You are booking an event for the following date.
        </Text>
        <Flex justify="center">
          <Fieldset radius="md" w={400} legend="Your Booking">
            <Text my={5} ta="center">
              Date:
            </Text>
            {slots.map((dat) => (
              <Text ta="center" key={dat.sdate}>
                SLOTS RESERVED: {dat.sdate}
              </Text>
            ))}
          </Fieldset>
        </Flex>
        <Text>Fill in the details provided below</Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex mt={20} direction="column" gap="md">
            <TextInput
              {...form.getInputProps("venue")}
              placeholder="Venues / Event Scheduler"
            />
          </Flex>
          <Group mt={40} justify="center">
            <Button>Cancel</Button>
            <Button loading={isPending} type="submit" bg="green">
              Book
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
};

export default Form;
