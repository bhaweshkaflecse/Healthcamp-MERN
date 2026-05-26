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
  Checkbox,
} from "@mantine/core";
import { useState } from "react";
import { axiosPublicInstance } from "../api";
import { signin } from "../api/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [signinclient] = useState<string | null>("client");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: any, endPoint: string) => {
    e.preventDefault();
    let body: { email: string; password: string } = { email, password };
    if (!body.email || !body.password) {
      toast.error("Insufficient credential");
      return;
    }
    try {
      setLoading(true);
      const resp = await axiosPublicInstance.post(endPoint, body, {
        headers: {
          Accept: "application/json",
        },
        params: {
          user: signinclient,
        },
      });

      if (resp.status == 201) {
        window.location.href = "/dashboard";
      }

      if(resp.status === 404){
        return toast.error("Error from the backend")
      }
      
      if (resp.status === 201 && isRememberMe) {
        window.localStorage.setItem("rToken", resp.data.refreshToken);
      } else {
        window.sessionStorage.setItem("rToken", resp.data.refreshToken);
      }
    } catch (error: any) {
      if (Array.isArray(error.response.data.message)) {
        error.response.data.message.map((item: any) => {
          toast.error(item);
        });
        return;
      }
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group justify="center" align="top" gap={0}>
        <Center h={540}>
          <Paper w={{ lg: "400", sm: "300" }} h={400} p={16}>
            <Flex direction="column">
              <Group gap={8}>
                <Image w={20} src="img/icon.png" />
                <Title c="#6092FE" size="h2">
                  Health Camp
                </Title>
              </Group>
              <Title mt={30} size="h3">
                Log In
              </Title>
              <Text mt={5} c="#969696">
                Please <span style={{ color: "black" }}>login</span> to continue
                with your account.
              </Text>
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
              <Text c="dimmed" size="sm" mt={10}>
                Forgot Password? <Link to="/forgot-password">Click here</Link>
              </Text>
              <Checkbox
                mt={20}
                label="Remember me"
                checked={isRememberMe}
                onChange={(event) =>
                  setIsRememberMe(event.currentTarget.checked)
                }
              />
              <Button
                loading={loading}
                onClick={(e) => handleSubmit(e, signin)}
                type="submit"
                mt={20}
              >
                Login
              </Button>
              {signinclient == "client" && (
                <>
                  <Text mt={20} ta="center">
                    or
                  </Text>

                  <Group justify="center" gap={5}>
                    <Text>Don't have an account?</Text>
                    <Link
                      to="/register"
                      style={{ cursor: "pointer", color: "#367AFF" }}
                    >
                      Sign Up
                    </Link>
                  </Group>
                </>
              )}
            </Flex>
          </Paper>
        </Center>

        <Image visibleFrom="sm" radius={5} w={400} src={"img/health.png"} />
      </Group>

      {/* Footer  */}

      {/* <Box bg="#FDB973" p={100}>
        <Flex direction={{ base: 'column', sm: 'row' }}
             justify={{ sm: 'space-between' }}
             gap={{base:'xl', sm:"lg"}}
             >
          <Box>
            <Image
              w={120}
              src="https://sumsnepalofficial.vercel.app/assets/logo-CDRVwuDh.png"
            />
            <Text fw="bold">Shape your ideas into value</Text>
            <Text />
          </Box>

          <Flex direction="column" gap={10}>
            <Text fw="bold">Company</Text>

            <Text>Meet the Team</Text>

            <Text>History</Text>

            <Text>Careers</Text>
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw="bold">Services</Text>

            <Text>Preincubation</Text>

            <Text>Incubation</Text>

            <Text>Hackathon</Text>

            <Text>Test Bed</Text>
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw="bold">Helpful Links</Text>

            <Text>Contact</Text>

            <Text>FAQs</Text>

            <Text>Live Chat</Text>
          </Flex>

          <Flex direction="column" gap={10}>
            <Text fw="bold">Legal</Text>

            <Text>Privacy Policy</Text>

            <Text>Terms & Conditions</Text>

            <Text>Returns Policy</Text>

            <Text>Accessibility</Text>
          </Flex>
        </Flex>

        <Text ta="center" mt={50}>
          © 2024 SUMS Nepal
        </Text>
      </Box> */}
    </>
  );
}
