import {
  TextInput,
  Button,
  Paper,
  Flex,
  Group,
  Title,
  Center,
  Image,
  PasswordInput,
  Checkbox,
} from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { signin } from "../../api/auth";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";

export default function SystemAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any, endPoint: string) => {
    e.preventDefault();
    let body: { email: string; password: string } = { email, password };
    try {
      const resp = await axiosPrivateInstance.post(endPoint, body, {
        headers: {
          Accept: "application/json",
        },
      });
      if (resp.status === 201) {
        navigate("/clientDashboard");
      }
    } catch (error: any) {
      console.log(error);
      // handleError(+error.response.status);
    } finally {
    }
  };

  return (
    <Group justify="center" gap={0}>
      <form onSubmit={() => handleSubmit}>
        <Center h={540}>
          <Paper w={{ lg: "400", sm: "300" }} h={400} p={16}>
            <Flex direction="column">
              <Group gap={8}>
                <Image w={20} src="img/icon.png" />
                <Title c="#6092FE" size="h2">
                  Namaste Admin
                </Title>
              </Group>

              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mt={20}
                placeholder="Email"
              />
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                mt={20}
                placeholder="Password"
              />
              <Checkbox mt={20} label="Remember me" />
              <Button
                onClick={(e) => handleSubmit(e, signin)}
                type="submit"
                mt={20}
              >
                Login
              </Button>
            </Flex>
          </Paper>
        </Center>
      </form>
      <Image visibleFrom="sm" radius={5} w={400} src={"img/health.png"} />
    </Group>
    // </BackgroundImage>
  );
}
