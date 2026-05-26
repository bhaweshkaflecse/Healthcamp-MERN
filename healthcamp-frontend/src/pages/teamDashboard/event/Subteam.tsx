// import {
//   Box,
//   Button,
//   Center,
//   Flex,
//   Group,
//   Image,
//   Loader,
//   Menu,
//   Paper,
//   Text,
//   Title,
// } from "@mantine/core";
// import { FaCheckCircle } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { useQuery } from "@tanstack/react-query";
// import { useLocation } from "react-router-dom";
// import { getAssignedSubteam } from "../../../api/booking";
// import { axiosPrivateInstance } from "../../../api";

// const Subteam = () => {
//   const location = useLocation();
//   const eventId = location.state;
//   console.log(eventId);
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["assignTeam"],
//     queryFn: async () => {
//       const response = await axiosPrivateInstance.get(
//         `${getAssignedSubteam}/${eventId}`,
//         {}
//       );
//       return response.data;
//     },
//   });
//   console.log(data);
//   if (isLoading) {
//     return (
//       <Center h="50vh">
//         <Box ta="center">
//           <Loader color="blue" />
//         </Box>
//       </Center>
//     );
//   }
//   if (error) {
//     console.log(error);
//   }

//   return (
//     <>
//       <Title size="h2" c="#6092FE">
//         Event Management
//       </Title>
//       <Paper withBorder mt={10} p={20}>
//         <Center>
//           <FaCheckCircle size={50} color="green" />
//         </Center>
//         <Text ta="center" mt={10}>
//           You have successfully assigned Dental 1 as event organizer to Digital
//           Pravidhi Pvt. Ltd. for their upcoming event Dental Health Maintenance
//           & Screening Service.{" "}
//         </Text>
//         <Group mt={30} justify="space-between">
//           <Text c="primary.0" fw={600} ta="center">
//             Sub Team Dental 1 Members
//           </Text>
//           <Button leftSection={<CiEdit size={20} />} variant="default">
//             Change Sub Team
//           </Button>
//         </Group>

//         <Flex gap={20} mt={30}>
//           <Paper p={10} pos="relative">
//             <Group justify="end">
//               <Menu shadow="md">
//                 <Menu.Target>
//                   <Button variant="subtle">
//                     <BsThreeDotsVertical size={20} />
//                   </Button>
//                 </Menu.Target>

//                 <Menu.Dropdown>
//                   <Menu.Item>Change Subteam</Menu.Item>
//                   <Menu.Item c="red">Remove member</Menu.Item>
//                 </Menu.Dropdown>
//               </Menu>
//             </Group>
//             <Center>
//               <Image w={100} radius="50%" src="/img/teamlead.jpg" />
//             </Center>
//             <Text mt={10} ta="center">
//               Digital Pravidhi Pvt. Ltd.
//             </Text>
//             <Text mt={5} ta="center" size="sm" c="blue">
//               UnitCoordinator
//             </Text>
//             <Text mt={5} ta="center" size="sm" c="dimmed">
//               Anamnagar KAthmandu
//             </Text>
//           </Paper>
//         </Flex>
//         <Text ta="center" mt={40} c="dimmed">
//           Reach out to the subteam members and notify them to prepare for the
//           upcoming event.
//         </Text>
//       </Paper>
//     </>
//   );
// };

// export default Subteam;

import {
  Box,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAssignedSubteam } from "../../../api/booking";
import { axiosPrivateInstance } from "../../../api";

const Subteam = () => {
  const location = useLocation();
  const eventId = location.state;
  console.log(eventId);
  const { data, error, isLoading } = useQuery({
    queryKey: ["assignTeam"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getAssignedSubteam}/${eventId}`,
        {}
      );
      return response.data;
    },
  });
  console.log(data);
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (error) {
    console.log(error);
  }

  return (
    <>
      <Title size="h2" c="#6092FE">
        Event Management
      </Title>
      <Paper withBorder mt={10} p={20}>
        <Center>
          <FaCheckCircle size={50} color="green" />
        </Center>
        <Text ta="center" mt={10}>
          You have successfully assigned {data?.subteam?.subTeam?.name} as event
          organizer to {data?.bookingDate?.booking?.client?.name} for their
          upcoming event{" "}
          {data?.bookingDate?.booking?.ServiceCalendar?.service?.name}.{" "}
        </Text>

        <Flex gap={20} mt={30}>
          <Paper p={10} pos="relative" withBorder>
            <Group justify="end">
              <Menu shadow="md">
                {/* <Menu.Target>
                  <Button variant="subtle">
                    <BsThreeDotsVertical size={20} />
                  </Button>
                </Menu.Target> */}

                <Menu.Dropdown>
                  <Menu.Item>Change Subteam</Menu.Item>
                  <Menu.Item c="red">Remove member</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Center>
              <Image w={100} radius="50%" src="/img/teamlead.jpg" />
            </Center>
            <Text mt={10} ta="center">
              Digital Pravidhi Pvt. Ltd.
            </Text>
            <Text mt={5} ta="center" size="sm" c="blue">
              UnitCoordinator
            </Text>
            <Text mt={5} ta="center" size="sm" c="dimmed">
              Anamnagar KAthmandu
            </Text>
          </Paper>
        </Flex>
        <Text ta="center" mt={40} c="dimmed">
          Reach out to the subteam members and notify them to prepare for the
          upcoming event.
        </Text>
      </Paper>
    </>
  );
};

export default Subteam;
