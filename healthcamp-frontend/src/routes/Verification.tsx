// import React from 'react'
import { useForm } from '@mantine/form';
import {  Button, Paper, Flex, Group, Center, Text, Title, Divider, PinInput } from '@mantine/core';
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";


const Verification = () => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { name: '', email: '' },
    
        // functions will be used to validate values at corresponding key
        validate: {
          name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    
        },
      });
    
  return (
    <form onSubmit={form.onSubmit(console.log)}>
    <Center h={640} >
      <Paper bg='whitesmoke' w={{lg:"400",sm:"300"}} h={400} p={16} withBorder>
        <Flex direction='column' >
          <Title size='h2'>Verification</Title>
          <Divider color='black' w={70} mt={5} />
         <Text>Enter Your Pin</Text>
          <PinInput/>
          {/* <Text>Confirm Your Pin</Text>
          <PinInput/> */}
          {/* <TextInput mt={20} placeholder="Name" {...form.getInputProps('name')} />
          <TextInput mt={20} placeholder="Email" {...form.getInputProps('email')} /> */}
          <Button type="submit" mt={20}>
            Login
          </Button>
          <Text mt={20} ta='center'>Or Login With</Text>
          <Group justify='center' mt={20}>
            <Button variant='light'><Group><FaFacebook />Facebook </Group></Button>
            <Button variant='light'><Group><FaGoogle color='red' /><Text c='red'>Google</Text> </Group></Button>
          </Group>
        </Flex>
      </Paper>
    </Center>
  </form>  )
}

export default Verification
