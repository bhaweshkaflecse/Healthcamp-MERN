import {
  Center,
  Divider,
  List,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../../api";
import { eventBookedDate } from "../../../api/calender";
import { Modal } from "@mantine/core";

const BookingCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedEventClients, setSelectedEventClients] = useState([]);
  const { id: serviceID } = useParams();

  // Fetch booked dates
  const { data: EventBookedDate } = useQuery({
    queryKey: [`EventBookedDate/${serviceID}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${eventBookedDate}/${serviceID}`
      );
      return response.data;
    },
  });

  // Format and add booking dates to calendar
  useEffect(() => {
    if (EventBookedDate) {
      const formattedEvents = EventBookedDate.flatMap((event: any) =>
        event.booking.flatMap((booking: any) =>
          booking.bookingDates.map((bookingDate: any) => ({
            id: bookingDate.id,
            title: "Booked",

            // title: `${booking.client?.name || "Unknown Client"}`,
            start: new Date(bookingDate.date),
            end: new Date(bookingDate.date),
            allDay: true,
            clients: [booking.client], // Store client details for modal
          }))
        )
      );
      setCalendarData(formattedEvents);
    }
  }, [EventBookedDate]);

  // Navigation handlers
  const handleNextYear = () => {
    const nextYear = new Date(currentDate);
    nextYear.setFullYear(currentDate.getFullYear() + 1);
    setCurrentDate(nextYear);
  };

  const handlePreviousYear = () => {
    const prevYear = new Date(currentDate);
    prevYear.setFullYear(currentDate.getFullYear() - 1);
    setCurrentDate(prevYear);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedEventClients(event.clients || []);
    setModalOpened(true);
  };

  // Custom styling for events
  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#6092FE", // Blue color for events
      color: "white",
      borderRadius: "5px",
      border: "none",
    },
  });

  return (
    <>
      <Title size="h2" c="#6092FE">
        Booking Calendar
      </Title>
      <Paper mt={10}>
        <Center>
          <Tabs defaultValue="current">
            <Tabs.List>
              <Tabs.Tab value="previous" onClick={handlePreviousYear}>
                Previous Year
              </Tabs.Tab>
              <Tabs.Tab value="current" onClick={handleToday}>
                Today
              </Tabs.Tab>
              <Tabs.Tab value="next" onClick={handleNextYear}>
                Next Year
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Center>
        <Space h="xl" />
        <Calendar
          localizer={localizer}
          events={calendarData}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "800px", width: "100%", margin: "auto" }}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={"month"}
          eventPropGetter={eventPropGetter} // Apply custom styling
          onSelectEvent={handleEventClick} // Handle event click
        />
      </Paper>

      {/* Modal for displaying client details */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        radius="md"
        padding="lg"
        shadow="xl"
        size="md"
      >
        <Stack gap="sm">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title size="h2" c="#6092FE">
              Client Having Events
            </Title>
            {/* <CloseButton onClick={() => setModalOpened(false)} /> */}
          </div>

          <Divider />

          <ScrollArea h={200}>
            <List spacing="sm" size="md">
              {selectedEventClients.length > 0 ? (
                selectedEventClients.map((client: any, index) => (
                  <List.Item fw={600} key={index}>
                    {client?.name || "Unknown Client"}
                  </List.Item>
                ))
              ) : (
                <Title size="h5" c="gray">
                  No clients found.
                </Title>
              )}
            </List>
          </ScrollArea>
        </Stack>
      </Modal>
    </>
  );
};

export default BookingCalendar;
