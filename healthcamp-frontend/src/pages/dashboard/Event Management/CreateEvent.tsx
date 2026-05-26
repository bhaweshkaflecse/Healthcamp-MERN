import {
  
  Button,
  Flex,
  Image,
  Input,
  Paper,
  Text,
  Title,
  
} from "@mantine/core";
import { Group } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";

const CreateEvent = (props: Partial<DropzoneProps>) => {
    const [showBox,SetShowBox]=useState(false);
    const [showDes,setShowDes] = useState(false)
    const handleClick =()=>{
        SetShowBox(sanjeev => !sanjeev)
    }
    const handleDesClick = () =>{
        setShowDes(prevstate => !prevstate)
    }
  return (
    <>
      <Title size="h2" c="#6092FE">
        Events
      </Title>
      <Paper p={10} mt={10} withBorder>
        <Title size="h3">Create New Event</Title>
        <Text>
          Add all the events details and let attendees know what to expect
        </Text>

        <Group
          style={{
            background: "rgba(0,0,0,0.5)",  
            backgroundImage: "url('img/image 8.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            
          }}
          mt={20}
          // bg={'#F8F9FA'}
          justify="center"
          h="80vh"
        >
          {/* <BackgroundImage src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png" /> */}

          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            color=""
            accept={IMAGE_MIME_TYPE}
            {...props}
          >
            <Group
              justify="center"
              gap="xl"
              style={{
                display: "flex",
                flexDirection: "column",
                pointerEvents: "none",
              }}
            >
                
              {/* <Dropzone.Accept>
                <IconUpload
                  style={{
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept> */}
              <Dropzone.Idle>
                {/* <IconPhoto
                                    style={{ height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                    stroke={1.5}
                                /> */}
                <Image w={50} src="img/Component 24.png" />
              </Dropzone.Idle>
              {/* <Dropzone.Reject>
                <IconX
                  style={{
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject> */}

              <div>
                <Text c="#6092FE" size="xl">
                  Upload Photos
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Group>
        <Paper mt={20} p={10} withBorder>
          <Group align="top" justify="space-between">
            <Flex direction={"column"}>
              <Title size="xs">Event Title</Title>
              <Text>Enter a catchy and informative title for your event</Text>
              {
                showBox && (
             <Input mt={5} placeholder="Enter Title Here" />
            )
              }
              </Flex>
            <CiCirclePlus onClick={handleClick} color="blue" size={25} />

          </Group>
        </Paper>
        <Paper mt={20} p={10} withBorder>
          <Group align="top" justify="space-between">
            <Flex direction={"column"}>
              <Title size="xs">About This Event</Title>
              <Text>
                you can include things to know, accessibility options-anything
                that will help people know what to expect.{" "}
              </Text>
              {
                showDes && (

                    <Input mt={5} placeholder="Describe About this Event"/>
                )
              }

            </Flex>
            <CiCirclePlus onClick={handleDesClick}  color="blue" size={25} />
          </Group>
        </Paper>
        <Flex mt={20} justify="end">
          <Button bg={"green.9"}>Assign</Button>
        </Flex>
      </Paper>
    </>
  );
};

export default CreateEvent;
