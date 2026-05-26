import { Box, Flex, Group, Image, Paper, Text, Title } from '@mantine/core'
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";
import { MdEventAvailable } from "react-icons/md";


const EventDetail = () => {
    return (
        <>
            <Title ml={20} size='h2' c='#6092FE'>Events</Title>
            <Paper p={18} m={20} withBorder>
                <Group justify='space-between'>
                    <Title size='h3'>Event Details</Title>
                    <Group>
                        <Title c='green.7' size='h3'>View Calender</Title>
                        <SlCalender size={20} color='green' />
                    </Group>
                </Group>
                <Paper mt={10} withBorder p={18}>
                    <Title size='h2'>Heart Health Check-Up Camp</Title>
                    <Flex mt={10} gap={20} wrap='wrap'>
                        <Image w={{lg:'24%',sm: '100%'}}  radius={5}  src='/img/eventdetail.png' />
                        <Text w={{lg:'70%',sm:'100%'}} >The Heart Health Check-Up Camp promotes cardiovascular wellness
                            through screenings, consultations, education, and partnerships.
                            Screenings include blood pressure, cholesterol, and ECGs, aiding
                            early detection. Participants receive guidance on lifestyle changes
                            and CPR training. Partnerships extend reach, addressing disparities.
                            The camp instills proactive health management, encouraging regular check-ups and healthy habits. Longitudinal studies assess efficacy, informing improvements. In essence, the camp is a beacon of hope, uniting communities in safeguarding heart health.</Text>
                    </Flex>
                    <Flex gap={15} w='100%' mt={20} >
                        <Group p={10} w='50%' bg='#E5ECFA' align='center' >
                            <SlCalender size={20} color='blue' />
                            <Box>
                                <p>Date</p>
                                <p>11 Jan, 2024</p>
                            </Box>
                        </Group>
                        <Group p={10} w='50%' bg='#E5ECFA'>
                            <Image h={20} w={20} src='/img/package.png' />
                            <Box>
                                <p>Package</p>
                                <p>Standard</p>
                            </Box>
                        </Group>
                    </Flex>

                    <Group p={10} mt={20} bg='#E5ECFA' align='center' >
                        <FaLocationDot size={20} color='blue' />
                        <Box>
                            <p>Location</p>
                            <p>Bijyachowk Gausala, Kathmandu near BhimsenGola or <a href="https://maps.app.goo.gl/PkUYMCp2ajGFBg2H8" target="_blank" rel="noopener noreferrer">Location Link</a></p>
                        </Box>
                    </Group>

                    <Group p={10} mt={20} bg='#E5ECFA' align='center' >
                        <MdEventAvailable size={20} color='blue' />
                        <Box>
                            <p>Event Scheduler</p>
                            <p>Himalaya Collage of Engineering</p>
                        </Box>
                    </Group>
                </Paper>

            </Paper>
        </>
    )
}

export default EventDetail