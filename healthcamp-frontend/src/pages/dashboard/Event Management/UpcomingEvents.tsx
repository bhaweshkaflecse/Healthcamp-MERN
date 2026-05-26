import { Paper, Group, Image, Box, Title, Text, Flex, Button, Space } from '@mantine/core'


import { FaMapMarkerAlt } from 'react-icons/fa'

import { upcomingeventdata } from '../rough/Rough'
// Create refs for each section

const UpcomingEvents = () => {



    return (<>
        <Title c='blue.5'>Booked Events</Title>
        <Paper mt={20} withBorder p={16}>
            <Group  >


                <Title size='h2'>Today's Event</Title>
                <Title size='h2'>Upcoming Events</Title>
                <Title size='h2'>Finished Events</Title>

            </Group>
            <Space h={'lg'} />
            <Space h={'lg'} />


            {upcomingeventdata.map((product, index) =>
                <Box >
                    <Paper key={index} withBorder p={15}>

                        <Group justify="space-between">


                            <Group>
                                <Image radius={10} w={{ lg: '200', sm: '50%', xs: '50%' }} src={product.img} />
                                <Box>
                                    <Title size='h2'>{product.title}</Title>
                                    <Text ta={'justify'} w={{ lg: '450', sm: '100%' }}>{product.description}</Text>
                                    <Group>
                                        <FaMapMarkerAlt size={20} />
                                        <Text>{product.location}</Text>
                                    </Group>
                                </Box>
                            </Group>
                            <Flex mt={'auto'}  >
                                <Button bg={'green.7'}>View More</Button>
                            </Flex>
                        </Group>
                    </Paper>
                    <Space h={'lg'} />

                </Box>
            )}


        </Paper>

    </>
    )
}

export default UpcomingEvents
