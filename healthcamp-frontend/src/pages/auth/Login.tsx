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
import { Link, useNavigate } from "react-router-dom";
import { axiosPublicInstance } from "../../api";
import { signin } from "../../api/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../../providers/context/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRole } = useAuthStore();

  const token =
    window.sessionStorage.getItem("rToken") ||
    window.localStorage.getItem("rToken");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
      toast.error("Log out first to be redirected to the login page.");
    }
  }, []);

  const handleSubmit = async (e: any, _endpoint: any) => {
    e.preventDefault();

    let body: { email: string; password: string } = { email, password };
    setLoading(!loading);
    try {
      const resp = await axiosPublicInstance.post(signin, body, {
        params: {
          user: "admin",
        },
      });
      const { refreshToken, role } = resp?.data;
      if (resp.status === 201) {
        if (isRememberMe) {
          window.localStorage.setItem("rToken", refreshToken);
        } else {
          window.sessionStorage.setItem("rToken", refreshToken);
        }

        setRole(role);
        toast.success("Login Successfully");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Group justify="center" align="top" gap={0}>
        <form onSubmit={(e) => handleSubmit(e, signin)}>
          <Center h={540}>
            <Paper w={{ lg: "400", sm: "300" }} h={400} p={16}>
              <Flex direction="column">
                <Group gap={8}>
                  <Image w={20} src="icon/icon.png" />
                  <Title c="#6092FE" size="h2">
                    Health Camp
                  </Title>
                </Group>
                <Title mt={30} size="h3">
                  Log In
                </Title>
                <Text mt={5} c="#969696">
                  Please <span style={{ color: "black" }}>login</span> to
                  continue with your account.
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
                <Flex justify="space-between">
                  <Checkbox
                    mt={20}
                    label="Remember me"
                    checked={isRememberMe}
                    onChange={(event) =>
                      setIsRememberMe(event.currentTarget.checked)
                    }
                  />
                  <Link
                
                    to="/forgot-password"
                    style={{ fontSize: "10px", color: "red", marginTop:"10px" }}
                  >
                    Forget password
                  </Link>
                </Flex>
                <Button
                  loading={loading}
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
    </>
  );
}
