import { Paper, Group, Image, Box, Title, Text, Flex, Button, Space, Tabs } from '@mantine/core'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { todayeventdata } from '../rough/Rough'
import { useNavigate } from 'react-router-dom'

// Create refs for each section

const TodayEvents = () => {
const navigate = useNavigate();

    return (
        <>
            <Tabs radius="lg" defaultValue="gallery">
                <Tabs.Panel value="gallery">
                    <Title size='h2' c='#6092FE'>Booked Events</Title>
                    <Paper withBorder p={16}>
                        <Group  >
                            <Tabs.List>
                                <Tabs.Tab value="gallery" >
                                    <Title fw={500} size='h4'>  Today's Events </Title>
                                </Tabs.Tab>
                                <Tabs.Tab value="messages" >
                                    <Title fw={500} size='h4'>  Upcoming Events </Title>
                                </Tabs.Tab>
                                <Tabs.Tab value="settings" >
                                    <Title fw={500} size='h4'>  Finished Events </Title>
                                </Tabs.Tab>
                            </Tabs.List>
                        </Group>
                        <Space h={'lg'} />
                        {todayeventdata.map((product, index) =>
                            <Box key={index} >
                                <Paper withBorder p={15}>
                                    <Group justify="space-between">
                                        <Group>
                                            <Image  radius={10} h={150} src={product.img} />
                                            <Button right={290}>Today</Button>
                                            <Box>
                                                <Title size='h3'>{product.title}</Title>
                                                <Text ta={'justify'} w={{ lg: '450', sm: '100%' }}>{product.description}</Text>
                                                <Group>
                                                    <FaMapMarkerAlt size={20} />
                                                    <Text>{product.location}</Text>
                                                </Group>
                                            </Box>
                                        </Group>
                                        <Flex mt={'auto'}  >
                                        <Button bg={'green.7'} onClick={()=>navigate('/event-detail')}>  View More
                                        </Button>
                                        </Flex>
                                    </Group>
                                </Paper>
                                <Space h={'lg'} />

                            </Box>
                        )}
                    </Paper>
                </Tabs.Panel>
                <Tabs.Panel value="messages">
                    <Title size='h2' c='#6092FE'>Booked Events</Title>
                    <Paper withBorder p={16}>
                        <Group  >
                            <Tabs.List>
                                <Tabs.Tab value="gallery" >
                                    <Title fw={500} size='h4'>  Today's Events </Title>
                                </Tabs.Tab>
                                <Tabs.Tab value="messages" >
                                    <Title fw={500} size='h4'>  Upcoming Events </Title>
                                </Tabs.Tab>
                                <Tabs.Tab value="settings" >
                                    <Title fw={500} size='h4'>  Finished Events </Title>
                                </Tabs.Tab>
                            </Tabs.List>
                        </Group>
                        <Space h={'lg'} />
                        {todayeventdata.map((product, index) =>
                            <Box key={index} >
                                <Paper withBorder p={15}>
                                    <Group justify="space-between">
                                        <Group>
                                            <Image radius={10} h={150} src={product.img} />
                                        <Button right={290}>Sep 12,2014</Button>
                                            <Box>
                                                <Title size='h3'>{product.title}</Title>
                                                <Text ta={'justify'} w={{ lg: '450', sm: '100%' }}>{product.description}</Text>
                                                <Group>
                                                    <FaMapMarkerAlt size={20} />
                                                    <Text>{product.location}</Text>
                                                </Group>
                                            </Box>
                                        </Group>
                                        <Flex mt={'auto'}  >
                                            <Button bg={'green.7'} onClick={()=>navigate('/event-detail')}  >View More</Button>
                                        </Flex>
                                    </Group>
                                </Paper>
                                <Space h={'lg'} />
                            </Box>
                        )}
                    </Paper>
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default TodayEvents
