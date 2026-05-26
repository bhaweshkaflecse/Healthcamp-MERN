import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Alert,
  Box,
  Button,
  Center,
  ColorSwatch,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getEventCalendar } from "../../api/event";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

interface Slot {
  id: string;
  date: string;
}

interface SelectedSlot {
  slotId: string;
  sdate: string;
}

const BookCalendar = () => {
  const { id } = useParams();
  const [bookableDates, setBookableDates] = useState(new Set());
  const [bookingDate, setBookingDate] = useState("");

  // const [selectedDate, setSelectedDate] = useState("");

  const [opened, { open, close }] = useDisclosure(false);
  const [slot, setSlot] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Set<SelectedSlot>>(
    new Set()
  );

  const location = useLocation();
  const enrollPackageId = location.state?.enrollPackageId;
  const enrollId = location.state?.enrollId;
  console.log('enroll id', enrollId)

  const navigate = useNavigate();

  const fetchAPI = async () => {
    const response = await axiosPrivateInstance.get(`${getEventCalendar}/${enrollId}`, {
      params: {
        serviceId: id,
      },
    });
    return response.data;
  };

  const { isLoading, data, error } = useQuery({
    queryFn: fetchAPI,
    queryKey: [`eventcalendar/${id}`],
    refetchInterval: 1000,
  });

  const numberOfSlots = Array.from(selectedSlots).length;

  useEffect(() => {
    if (data) {
      const datesSet = new Set(
        data[0].eventCalendar
          .filter((event: { isBookable: any }) => event.isBookable)
          .map((event: { date: moment.MomentInput }) =>
            moment(event.date).format("YYYY-MM-DD")
          )
      );
      setBookableDates(datesSet);
    }
  }, [data]);

  const startDate = data?.[0]?.startDate;
  const endDate = data?.[0]?.endDate;

  const selectSlot = async (hero: any) => {
    const realDate = new Date(hero.start).toLocaleDateString("en-CA");
    setBookingDate(realDate);

    if (
      new Date(realDate) < new Date(startDate) ||
      new Date(realDate) > new Date(endDate)
    ) {
      toast.error("Selected date is outside the bookable range.");
      return;
    }

    // Check isBookable BEFORE generating slots
    const calendar = data[0].eventCalendar.filter(
      (cal: any) => cal.date === realDate
    );
    if (calendar[0]?.isBookable === false) {
      toast.error("This slot is not bookable");
      return;
    }

    const items = data[0].eventCalendar.filter(
      (item: any) => item.date === realDate
    );
    if (items.length && typeof items[0].bookableSlot === "number") {
      setSlot([]);
      for (let i = 0; i < items[0].bookableSlot; i++) {
        setSlot((prevItem) => [
          ...prevItem,
          { id: `${realDate}${i}`, date: realDate },
        ]);
      }
    } else {
      setSlot([{ id: `${realDate}`, date: realDate }]);
    }

    open();
  };

  const handleButtonClick = (slotId: string, sdate: string) => {
    setSelectedSlots((prev) => {
      const newSelection = new Set(prev);

      const isSelected = Array.from(newSelection).some(
        (slot: SelectedSlot) => slot.slotId === slotId && slot.sdate === sdate
      );

      if (isSelected) {
        newSelection.forEach((slot) => {
          if (slot.slotId === slotId && slot.sdate === sdate) {
            newSelection.delete(slot);
          }
        });
      } else {
        newSelection.add({ slotId, sdate });
      }
      return newSelection;
    });
  };

  const dayPropGetter = (date: moment.MomentInput) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const isBookable = bookableDates.has(formattedDate);
    const isInRange =
    formattedDate >= moment(startDate).format("YYYY-MM-DD") &&
    formattedDate <= moment(endDate).format("YYYY-MM-DD");
  
    const isSelected = Array.from(selectedSlots).some(
      (slot) => slot.sdate === formattedDate
    );

    const isNonBookableDate = isInRange && !isBookable && data[0].eventCalendar.some(
      (event: any) =>
        moment(event.date).format("YYYY-MM-DD") === formattedDate &&
        !event.isBookable
    );

    const style = {
      backgroundColor: !isInRange
        ? "#E5E5E5"
        : isSelected
        ? "yellow"
        : isBookable
        ? "white"
        : isNonBookableDate
        ? "red"
        : "white",
      pointerEvents: (!isInRange || isNonBookableDate) ? "none" : "auto",
      cursor: (!isInRange || isNonBookableDate) ? "not-allowed" : "pointer",
      color: !isInRange ? "red" : "inherit",
    };

    return {
      style,
    };
  };

  if (error) {
    return (
      <Alert variant="light" color="red" title="Error in fetching data">
        <p>
          {error instanceof AxiosError
            ? // @ts-ignore
              error.response.data.message
            : "Error occurred, please try again later"}
        </p>
      </Alert>
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

  return (
    <>
      <Flex align="center" gap={10} justify="space-between">
        <Flex align="center" gap={10} justify="center">
          <Title variant="h1" c="#6092FE">
            Book Event
          </Title>
          <FaCalendarAlt size={30} color="#6092FE" />
        </Flex>
        <Paper withBorder p="sm">
          <Flex align="center" gap="xl">
            <Flex align="center" gap="xs">
              <ColorSwatch color="yellow" />
              <b>Selected</b>
            </Flex>
            <Flex align="center" gap="xs">
              <ColorSwatch color="#fff" />
              <b>Bookable</b>
            </Flex>
            <Flex align="center" gap="xs">
              <ColorSwatch color="#FF6665" />
              <b>Not-Bookable</b>
            </Flex>
          </Flex>
        </Paper>
      </Flex>
      <Space h="xl" />
      <Text p="sm" my="sm" fw="bold">
        No of slots to be booked :{" "}
        <span style={{ color: "red" }}>{data?.[0]?.requestedSlot}</span>{" "}
      </Text>
      <Paper p="lg" withBorder h={800}>
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "90%" }}
          //@ts-ignore
          dayPropGetter={dayPropGetter}
          views={["month"]}
          defaultView="month"
          selectable
          onSelectSlot={selectSlot}
        />

        <Flex justify="end" mt="md">
          <Button
            disabled={numberOfSlots !== data?.[0]?.requestedSlot}
            onClick={() => {
              // Validate all selected slots are still bookable
              const hasInvalidSlot = Array.from(selectedSlots).some(
                (slot) => {
                  const calEntry = data[0].eventCalendar.find(
                    (cal: any) => cal.date === slot.sdate
                  );
                  return calEntry && calEntry.isBookable === false;
                }
              );
              if (hasInvalidSlot) {
                toast.error("Some selected dates are no longer bookable. Please reselect.");
                return;
              }
              navigate("/calender-form", {
                state: { selectedSlots, data, enrollPackageId },
              });
            }}
            size="lg"
          >
            Book Event
          </Button>
        </Flex>
      </Paper>

      <Modal
        size="md"
        opened={opened}
        onClose={close}
        title={
          <Text>
            Date Selected: <span style={{ color: "red" }}>{bookingDate}</span>
          </Text>
        }
      >
        <Paper p="xs" withBorder>
          <Text ta="center">Select the slots.</Text>
          {slot.map((s, index) => {
            // Check how many slots for this date are already selected
            const slotsSelectedForDate = Array.from(selectedSlots).filter(
              (sel) => sel.sdate === s.date
            ).length;
            const calEntry = data[0].eventCalendar.find(
              (cal: any) => cal.date === s.date
            );
            const maxSlots = calEntry?.bookableSlot ?? Infinity;
            const isAlreadySelected = Array.from(selectedSlots).some(
              (slot) => slot.slotId === s.id && slot.sdate === s.date
            );
            // Disable if max slots consumed and this slot is not already selected
            const isDisabled = !isAlreadySelected && slotsSelectedForDate >= maxSlots;

            return (
            <Flex
              key={index}
              direction="column"
              gap="xs"
              mt={30}
              justify="space-between"
            >
              <Group
                p="xs"
                justify="space-between"
                bg={
                  isAlreadySelected
                    ? "#d0d0d0"
                    : "#e5ecfa"
                }
              >
                <Text>Slot {index + 1}</Text>
                <Flex justify="end" gap="sm">
                  <Button
                    onClick={() => handleButtonClick(s.id, s.date)}
                    variant="default"
                    disabled={isDisabled}
                  >
                    {isAlreadySelected
                      ? "Deselect"
                      : "Select"}
                  </Button>
                </Flex>
              </Group>
            </Flex>
            );
          })}
          <Flex justify="end" mt="md"></Flex>
        </Paper>
      </Modal>
    </>
  );
};

export default BookCalendar;
