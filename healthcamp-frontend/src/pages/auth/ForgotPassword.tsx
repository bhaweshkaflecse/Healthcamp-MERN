import { useState } from "react";
import {
  Paper,
  Flex,
  Group,
  Center,
  Alert,
  Title,
  Text,
  Box,
  Button,
  TextInput,
} from "@mantine/core";
import { axiosPublicInstance } from "../../api";
import { forgetPassword } from "../../api/auth";

const ForgotPassword = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [load, isLoad] = useState(false);

  const handleSubmit = async () => {
    isLoad(true);
    try {
      const resp = await axiosPublicInstance.post(
        forgetPassword,
        { email: email },
        {
          params: {
            user: "admin",
          },
        }
      );
      if (resp.data === true) {
        setShowAlert(true);
        setError(false);
      }
    } catch (error) {
      setError(true);
    } finally {
      isLoad(false);
    }
  };
  return (
    <>
      <Box>
        <Group justify="center" align="top" gap={0}>
          <Center>
            <Paper w={{ lg: "400", sm: "300" }} h={400} p={16}>
              <Flex direction="column">
                <Group gap={8}>
                  <Title c="#6092FE" size="h2">
                    Health Camp
                  </Title>
                </Group>
                <Title mt={30} size="h3">
                  Forgot Password
                </Title>
                <Text mt={5} c="#969696">
                  Please enter your email
                </Text>
                <TextInput
                  onChange={(e: any) => setEmail(e.target.value)}
                  mt={20}
                  placeholder="Email"
                />

                <Button
                  onClick={handleSubmit}
                  type="submit"
                  mt={20}
                  loading={load}
                >
                  Enter
                </Button>
              </Flex>
            </Paper>
          </Center>
        </Group>
      </Box>
      {error && (
        <Center>
          <Box w={400}>
            <Alert variant="light" color="red" title="Error Occured">
              Some error occured on you request. try these step:
              <ul>
                <li>Your input field must have value.</li>
                <li>Be sure you have given regestered email.</li>
                <li>Try refreshing page and try again.</li>
              </ul>
            </Alert>
          </Box>
        </Center>
      )}
      {showAlert && (
        <Center>
          <Box w={400}>
            <Alert
              variant="light"
              color="green"
              title="Email sent successfully"
            >
              Please click in the link sent to {email} to update your password.
              <br />
              <br />
              Remember your validation time will be only 15 minutes.
            </Alert>
          </Box>
        </Center>
      )}
    </>
  );
};

export default ForgotPassword;
