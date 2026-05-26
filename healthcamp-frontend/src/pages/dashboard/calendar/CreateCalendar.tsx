// import {
//   Alert,
//   Badge,
//   Box,
//   Button,
//   Center,
//   Divider,
//   Flex,
//   Loader,
//   Modal,
//   Paper,
//   Space,
//   Stack,
//   Switch,
//   Tabs,
//   Title,
// } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Text } from "@mantine/core";
// import { useCounter, useDisclosure } from "@mantine/hooks";
// import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
// import {
//   createCalendar,
//   createDateSlot,
//   getCalendarByServiceId,
//   isDateAdded,
//   updateDateSlot,
// } from "../../../api/calender";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { axiosPrivateInstance } from "../../../api";

// const CreateCalendar = () => {
//   const location = useLocation();
//   const localizer = momentLocalizer(moment);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [hasCalender, _setHasCalendar] = useState(location.state?.hasCalender);
//   const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);
//   const [activeDate, setActiveDate] = useState<Date>();
//   const [count, handlers] = useCounter(0, { min: 1, max: 10 });
//   const { id: serviceID } = useParams();
//   const [btnValue, setBtnValue] = useState("");
//   const [calendarData, setCalendarData] = useState([]);

//   interface formDataType {
//     date: Date;
//     isDisabled: boolean;
//     dateSlot: string;
//     slot: number;
//   }

//   const [formDta, setFormDta] = useState<formDataType>({
//     date: new Date(),
//     isDisabled: false,
//     dateSlot: "",
//     slot: 1,
//   });
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   /* ============================= API ============================= */
//   const { isPending: creatingCalender, mutate: creatingCalenderFunc } =
//     useMutation({
//       mutationFn: async () =>
//         await axiosPrivateInstance.post(createCalendar, { service: serviceID }),
//       onSuccess: (data) => {
//         queryClient.invalidateQueries({
//           queryKey: ["serviceList"],
//           refetchType: "active",
//           exact: true,
//         });
//         console.log(data);
//         toast.success("Calender created successfully");
//         navigate("/services");
//       },
//       onError: (error: any) => {
//         toast.error(error.message);
//       },
//     });

//   const {
//     isLoading,
//     data,
//     error: errorToGet,
//   } = useQuery({
//     enabled: hasCalender,
//     queryKey: [`calendarData/${serviceID}`],
//     queryFn: async () => {
//       const response = await axiosPrivateInstance.get(
//         `${getCalendarByServiceId}/${serviceID}`,
       
//       );

//       return response.data;
//     },
//   });
  
//   const {
//     isPending: isUpdatingCalendarSlot,
//     mutate: updatingCalendarSlotFunc,
//   } = useMutation({
//     mutationFn: async () => {
//       const payload = {
//         date: moment(activeDate).format("YYYY-MM-DD"),
//         isDisabled: formDta?.isDisabled,
//         slot: formDta?.slot,
//         calender: data.id,
//       };

//       if (dataModal) {
//         await axiosPrivateInstance.patch(
//           `${updateDateSlot}/${formDta.dateSlot}`,
//           payload,
//           {}
//         );
//       } else {
//         await axiosPrivateInstance.post(createDateSlot, payload);
//       }
//     },

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [`calendarData/${serviceID}`],
//         refetchType: "active",
//         exact: true,
//       });
//       console.log(data);
//       toast.success("Calender updated successfully");
//       closeModal();
//     },
//     onError: (error: any) => {
//       closeModal();
//       toast.error(error.message);
//     },
//   });

//   const {
//     isLoading: isModalDtaLoading,
//     data: dataModal,
//     error: errorToGetModal,
//   } = useQuery({
//     enabled: opened,
//     queryKey: [null],
//     queryFn: async () => {
//       const response = await axiosPrivateInstance.get(`${isDateAdded}`, {
//         params: {
//           date: activeDate,
//           calendar: data.id,
//         },
//       });

//       setBtnValue(response.data);
//       return response.data;
//     },
//     gcTime: 0,
//     staleTime: 0,
//   });
//   /* =============================================================== */
//   useEffect(() => {
//     if (data && data.dateSlots) {
//       const formattedEvents = data.dateSlots.map((event: any) => ({
//         id: event.id,
//         title: `Slot ${event.slot}`,
//         start: event.date,
//         end: event.date,
//         allDay: false,
//         isDisabled: event.isDisabled,
//       }));
//       setCalendarData(formattedEvents);
//     }
//   }, [isLoading, data]);

//   const eventPropGetter = (event: any) => {
//     if (event.isDisabled) {
//       return {
//         style: {
//           display: "none",
//         },
//       };
//     }
//     return {
//       style: {
//         backgroundColor: "green",
//       },
//     }; 
//   };

//   const handleSelectSlot =(slotInfo: any) => {
//     const selectedDate = data.dateSlots?.find((event: any) => {
//       const slotInfoDate = new Date(slotInfo.start);
//       const eventDate = new Date(event.date);
//       const isSameDate =
//         slotInfoDate.getFullYear() === eventDate.getFullYear() &&
//         slotInfoDate.getMonth() === eventDate.getMonth() &&
//         slotInfoDate.getDate() === eventDate.getDate();

//       return isSameDate;
//     });
//     if (selectedDate) {
//       setFormDta({
//         dateSlot: selectedDate.id,
//         date: new Date(selectedDate.date),
//         isDisabled: selectedDate.isDisabled,
//         slot: selectedDate.slot,
//       });
//       handlers.set(selectedDate.slot);
//     } else {
//       handlers.set(1);
//       setFormDta({
//         dateSlot: "",
//         date: new Date(),
//         isDisabled: false,
//         slot: 1,
//       });
//     }
//     const date = new Date(slotInfo.start);
//     setActiveDate(moment(slotInfo.start).startOf('day').toDate());
//     openModal();
//   };

//   useEffect(() => {
//     setFormDta((prevFormDta) => ({
//       ...prevFormDta,
//       slot: count,
//     }));
//   }, [count]);

//   const dayPropGetter = (date: any) => {
//     const isDisabled = data.dateSlots?.some((event: any) => {
//       const eventDate = new Date(event.date);
//       const currentDate = new Date(date);
//       const fullEventDate = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
//       const currentFullDate = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
//       return fullEventDate === currentFullDate && event.isDisabled;
//     });
//     if (isDisabled) {
//       return {
//         style: {
//           backgroundColor: "red",
//           cursor: "not-allowed",
//           opacity: 0.5,
//         },
//       };
//     } else {
//       return {
//         style: {
//           cursor: "pointer",
//         },
//       };
//     }
//   };

//   // Event functions
//   const handleNextYear = () => {
//     const nextYear = new Date(
//       currentDate.setFullYear(currentDate.getFullYear() + 1)
//     );
//     setCurrentDate(nextYear);
//   };

//   const handlePreviousYear = () => {
//     const prevYear = new Date(
//       currentDate.setFullYear(currentDate.getFullYear() - 1)
//     );
//     setCurrentDate(prevYear);
//   };

//   const handleToday = () => {
//     setCurrentDate(new Date());
//   };
//   if (!hasCalender) {
//     return (
//       <>
//         <Alert variant="light" color="red" title="Calendar Not Found">
//           No calendar associated with this service was found. To proceed with
//           additional functionalities and the reservation process for clients, it
//           is imperative to establish a calendar. Please click the button below
//           to create a calendar, which is a crucial step in facilitating seamless
//           operations and ensuring efficient booking management.
//         </Alert>
//         <br />
//         <Button
//           onClick={() => creatingCalenderFunc()}
//           loading={creatingCalender}
//         >
//           Create here
//         </Button>
//       </>
//     );
//   }
//   if (isLoading) {
//     return (
//       <Center h="50vh">
//         <Box ta="center">
//           <Loader color="blue" />
//         </Box>
//       </Center>
//     );
//   }
//   if (errorToGet) {
//     return (
//       <Alert variant="light" color="red" title="Error in fetching data">
//         {errorToGet.message}
//       </Alert>
//     );
//   }
//   console.log(btnValue);
//   return (
//     <>
//       <Title size="h2" c="#6092FE">
//         {data.service.name}
//       </Title>
//       <br />
//       <Paper>
//         <Center>
//           <Tabs defaultValue="current">
//             <Tabs.List>
//               <Tabs.Tab value="previous" onClick={handlePreviousYear}>
//                 Previous Year
//               </Tabs.Tab>
//               <Tabs.Tab value="current" onClick={handleToday}>
//                 Today
//               </Tabs.Tab>
//               <Tabs.Tab value="next" onClick={handleNextYear}>
//                 Next Year
//               </Tabs.Tab>
//             </Tabs.List>
//           </Tabs>
//         </Center>
//         <Space h="xl" />
//         <Calendar
//           localizer={localizer}
//           events={calendarData}
//           startAccessor="start"
//           endAccessor="end"
//           selectable
//           onSelectSlot={handleSelectSlot}
//           eventPropGetter={eventPropGetter}
//           dayPropGetter={dayPropGetter}
//           style={{ height: 800, width: "100%", margin: "auto" }}
//           date={currentDate}
//           onNavigate={(date) => setCurrentDate(date)}
//           view={"month"}
//         />
//       </Paper>
//       <Modal opened={opened} onClose={closeModal} radius="lg">
//         {errorToGetModal ? (
//           <Alert variant="light" color="red" title="Error in fetching data">
//             {errorToGetModal?.message}
//           </Alert>
//         ) : isModalDtaLoading ? (
//           <Center h="50vh">
//             <Box ta="center">
//               <Loader color="blue" />
//             </Box>
//           </Center>
//         ) : (
//           <>
//             <Paper>
//               <Flex justify="space-between" align="center">
//                 <Flex align="center" gap="sm">
//                   <Divider
//                     size="xl"
//                     orientation="vertical"
//                     h={70}
//                     color="blue"
//                   />
//                   <Title size="60" c="blue">
//                     {activeDate?.getDate()}
//                   </Title>
//                 </Flex>
//                 <Stack gap="0">
//                   <strong>
//                     {activeDate?.toString().split(" ")[0].toUpperCase()}
//                   </strong>
//                   <Text c="#878787">
//                     {activeDate?.getMonth() + "," + activeDate?.getFullYear()}
//                   </Text>
//                 </Stack>
//               </Flex>
//             </Paper>
//             <Divider my="sm" variant="solid" />
//             <Stack gap="md">
//               <Flex justify="space-between">
//                 <Text c="#878787">Current Status:</Text>
//                 <Badge color={!formDta?.isDisabled ? "green" : "red"}>
//                   {formDta?.isDisabled ? "Non-bookable" : "Bookable"}
//                 </Badge>
//               </Flex>
//               <Flex justify="space-between">
//                 <Text c="#878787">Make Disable:</Text>
//                 <Switch
//                   checked={formDta?.isDisabled || false}
//                   onChange={(e) =>
//                     setFormDta({ ...formDta, isDisabled: e.target.checked })
//                   }
//                 />
//               </Flex>
//               <Flex justify="space-between">
//                 <Text c="#878787">No. of slots:</Text>
//                 <Paper radius="xs" withBorder>
//                   <Flex align="center" gap="md">
//                     <FaCaretLeft
//                       size={25}
//                       onClick={() => handlers.decrement()}
//                     />
//                     <Text size="lg">{count}</Text>
//                     <FaCaretRight
//                       size={25}
//                       onClick={() => handlers.increment()}
//                     />
//                   </Flex>
//                 </Paper>
//               </Flex>
//             </Stack>
//             <Divider my="sm" variant="solid" />
//             <Button
//               loading={isUpdatingCalendarSlot}
//               onClick={() => updatingCalendarSlotFunc()}
//             >
//               {dataModal ? "Update" : "Save"}
//             </Button>
//           </>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default CreateCalendar;

import {
  Alert,
  Badge,
  Button,
  Center,
  Divider,
  Flex,
  Loader,
  Modal,
  Paper,
  Space,
  Stack,
  Switch,
  Tabs,
  Title,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import {
  createCalendar,
  createDateSlot,
  getCalendarByServiceId,
  isDateAdded,
  updateDateSlot,
} from "../../../api/calender";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";

const CreateCalendar = () => {
  const location = useLocation();
  const localizer = momentLocalizer(moment);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasCalender, _setHasCalendar] = useState(location.state?.hasCalender);
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [activeDate, setActiveDate] = useState<Date>();
  const [count, handlers] = useCounter(0, { min: 1, max: 10 });
  const { id: serviceID } = useParams();
  const [, setBtnValue] = useState("");
  const [calendarData, setCalendarData] = useState([]);

  interface formDataType {
    date: Date;
    isDisabled: boolean;
    dateSlot: string;
    slot: number;
  }

  const [formDta, setFormDta] = useState<formDataType>({
    date: new Date(),
    isDisabled: false,
    dateSlot: "",
    slot: 1,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: creatingCalender, mutate: creatingCalenderFunc } =
    useMutation({
      mutationFn: async () =>
        await axiosPrivateInstance.post(createCalendar, { service: serviceID }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["serviceList"],
          refetchType: "active",
          exact: true,
        });
        toast.success("Calendar created successfully");
        navigate("/services");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

  const {
    isLoading,
    data,
    error: errorToGet,
  } = useQuery({
    enabled: hasCalender,
    queryKey: [`calendarData/${serviceID}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getCalendarByServiceId}/${serviceID}`
      );
      return response.data;
    },
  });

  const {
    isPending: isUpdatingCalendarSlot,
    mutate: updatingCalendarSlotFunc,
  } = useMutation({
    mutationFn: async () => {
      const payload = {
        date: moment(activeDate).format("YYYY-MM-DD"),
        isDisabled: formDta?.isDisabled,
        slot: formDta?.slot,
        calender: data.id,
      };

      if (dataModal) {
        await axiosPrivateInstance.patch(
          `${updateDateSlot}/${formDta.dateSlot}`,
          payload
        );
      } else {
        await axiosPrivateInstance.post(createDateSlot, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`calendarData/${serviceID}`],
        refetchType: "active",
        exact: true,
      });
      toast.success("Calendar updated successfully");
      closeModal();
    },
    onError: (error: any) => {
      closeModal();
      toast.error(error.message);
    },
  });

  const {
    isLoading: isModalDtaLoading,
    data: dataModal,
    error: errorToGetModal,
  } = useQuery({
    enabled: opened,
    queryKey: ["calendar-slot-check"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${isDateAdded}`, {
        params: {
          date: moment(activeDate).format("YYYY-MM-DD"),
          calendar: data.id,
        },
      });

      setBtnValue(response.data);
      return response.data;
    },
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (data && data.dateSlots) {
      const formattedEvents = data.dateSlots.map((event: any) => ({
        id: event.id,
        title: `Slot ${event.slot}`,
        start: new Date(event.date),
        end: new Date(event.date),
        allDay: false,
        isDisabled: event.isDisabled,
      }));
      setCalendarData(formattedEvents);
    }
  }, [isLoading, data]);

  const eventPropGetter = (event: any) => {
    if (event.isDisabled) {
      return {
        style: {
          display: "none",
        },
      };
    }
    return {
      style: {
        backgroundColor: "green",
      },
    };
  };

  const handleSelectSlot = (slotInfo: any) => {
    const clickedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const selectedDate = data.dateSlots?.find((event: any) => {
      const eventDate = moment(event.date).format("YYYY-MM-DD");
      return eventDate === clickedDate;
    });

    if (selectedDate) {
      setFormDta({
        dateSlot: selectedDate.id,
        date: new Date(selectedDate.date),
        isDisabled: selectedDate.isDisabled,
        slot: selectedDate.slot,
      });
      handlers.set(selectedDate.slot);
    } else {
      handlers.set(1);
      setFormDta({
        dateSlot: "",
        date: new Date(),
        isDisabled: false,
        slot: 1,
      });
    }

    const normalizedDate = moment(slotInfo.start).startOf("day").toDate();
    setActiveDate(normalizedDate);
    openModal();
  };

  useEffect(() => {
    setFormDta((prevFormDta) => ({
      ...prevFormDta,
      slot: count,
    }));
  }, [count]);

  const dayPropGetter = (date: any) => {
    const isDisabled = data.dateSlots?.some((event: any) => {
      const eventDate = moment(event.date).format("YYYY-MM-DD");
      const currentDate = moment(date).format("YYYY-MM-DD");
      return eventDate === currentDate && event.isDisabled;
    });
    if (isDisabled) {
      return {
        style: {
          backgroundColor: "red",
          cursor: "not-allowed",
          opacity: 0.5,
        },
      };
    } else {
      return {
        style: {
          cursor: "pointer",
        },
      };
    }
  };

  const handleNextYear = () => {
    const nextYear = new Date(
      currentDate.setFullYear(currentDate.getFullYear() + 1)
    );
    setCurrentDate(nextYear);
  };

  const handlePreviousYear = () => {
    const prevYear = new Date(
      currentDate.setFullYear(currentDate.getFullYear() - 1)
    );
    setCurrentDate(prevYear);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (!hasCalender) {
    return (
      <>
        <Alert variant="light" color="red" title="Calendar Not Found">
          No calendar associated with this service was found. Please create one
          to continue.
        </Alert>
        <br />
        <Button onClick={() => creatingCalenderFunc()} loading={creatingCalender}>
          Create here
        </Button>
      </>
    );
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader color="blue" />
      </Center>
    );
  }

  if (errorToGet) {
    return (
      <Alert variant="light" color="red" title="Error in fetching data">
        {errorToGet.message}
      </Alert>
    );
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        {data.service.name}
      </Title>
      <br />
      <Paper>
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
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          style={{ height: 800, width: "100%", margin: "auto" }}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={"month"}
        />
      </Paper>

      <Modal opened={opened} onClose={closeModal} radius="lg">
        {errorToGetModal ? (
          <Alert variant="light" color="red" title="Error in fetching data">
            {errorToGetModal?.message}
          </Alert>
        ) : isModalDtaLoading ? (
          <Center h="50vh">
            <Loader color="blue" />
          </Center>
        ) : (
          <>
            <Paper>
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="sm">
                  <Divider size="xl" orientation="vertical" h={70} color="blue" />
                  <Title size="60" c="blue">
                    {activeDate?.getDate()}
                  </Title>
                </Flex>
                <Stack gap="0">
                  <strong>
                    {activeDate?.toString().split(" ")[0].toUpperCase()}
                  </strong>
                  <Text c="#878787">
                    {/* @ts-ignore */}
                    {activeDate?.getMonth() + 1 + "," + activeDate?.getFullYear()}
                  </Text>
                </Stack>
              </Flex>
            </Paper>
            <Divider my="sm" variant="solid" />
            <Stack gap="md">
              <Flex justify="space-between">
                <Text c="#878787">Current Status:</Text>
                <Badge color={!formDta?.isDisabled ? "green" : "red"}>
                  {formDta?.isDisabled ? "Non-bookable" : "Bookable"}
                </Badge>
              </Flex>
              <Flex justify="space-between">
                <Text c="#878787">Make Disable:</Text>
                <Switch
                  checked={formDta?.isDisabled || false}
                  onChange={(e) =>
                    setFormDta({ ...formDta, isDisabled: e.target.checked })
                  }
                />
              </Flex>
              <Flex justify="space-between">
                <Text c="#878787">No. of slots:</Text>
                <Paper radius="xs" withBorder>
                  <Flex align="center" gap="md">
                    <FaCaretLeft size={25} onClick={() => handlers.decrement()} />
                    <Text size="lg">{count}</Text>
                    <FaCaretRight size={25} onClick={() => handlers.increment()} />
                  </Flex>
                </Paper>
              </Flex>
            </Stack>
            <Divider my="sm" variant="solid" />
            <Button
              loading={isUpdatingCalendarSlot}
              onClick={() => updatingCalendarSlotFunc()}
            >
              {dataModal ? "Update" : "Save"}
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateCalendar;
