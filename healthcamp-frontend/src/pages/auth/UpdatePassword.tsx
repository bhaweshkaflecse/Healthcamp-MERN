import {
  TextInput,
  Button,
  Paper,
  Flex,
  Group,
  Title,
  Center,
  Text,
  Image,
  PasswordInput,
  Box,
  Alert,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { updatePassword } from "../../api/auth";
import { axiosPrivateInstance } from "../../api";
import { toast } from "react-toastify";

export default function UpdatePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const resp = await axiosPrivateInstance.patch(updatePassword, {
        email,
        password,
        token,
      });
      if (resp.status === 200) {
        setSuccessMsg("Successfully updated password.");
        setError("");
        toast.success("Successfully updated password.");
        navigate("/login");
      } else {
        setError("Failed to update password.");
      }
    } catch (err: any) {
      setSuccessMsg("");
      console.log(err.response);
      if (err.response) {
        if (err.response.status === 408) {
          setError("Connection timeout.");
        } else {
          setError(
            err.response.data.message || "An unexpected error occurred."
          );
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group justify="center" align="top" gap={0}>
        <Box>
          <Center h={540}>
            <Paper w={{ lg: 400, sm: 300 }} h={400} p={16}>
              <Flex direction="column">
                <Group gap={8}>
                  <Image w={20} src="img/icon.png" />
                  <Title c="#6092FE" size="h2">
                    Health Camp
                  </Title>
                </Group>
                <Title mt={30} size="h3">
                  Update Password
                </Title>
                <Text mt={5} c="#969696">
                  Please enter your details
                </Text>
                <TextInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mt={20}
                  placeholder="Email"
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  mt={20}
                  placeholder="New Password"
                />

                <Button
                  loading={loading}
                  onClick={handleSubmit}
                  type="submit"
                  mt={20}
                >
                  Enter
                </Button>
              </Flex>
            </Paper>
          </Center>
        </Box>
      </Group>
      <Box>
        {successMsg && (
          <Box w={400}>
            <Alert variant="light" color="green" title="Success">
              {successMsg}
            </Alert>
          </Box>
        )}
        {error && (
          <Center>
            <Box w={400}>
              <Alert variant="light" color="red" title="Error Occurred">
                {error}
              </Alert>
            </Box>
          </Center>
        )}
      </Box>
    </>
  );
}
