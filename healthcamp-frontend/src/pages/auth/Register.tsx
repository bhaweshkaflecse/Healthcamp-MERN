import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Paper,
  Flex,
  Group,
  Center,
  Title,
  Image,
  ScrollArea,
  Text,
  NumberInput,
  PinInput,
  PasswordInput,
  Stepper,
  Space,
} from "@mantine/core";
import { useState } from "react";
import {
  generateOTPForAuth,
  // getmyinfo,
  registerCliet,
  verifyOTP,
} from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";

function Login() {
  const [active, setActive] = useState(0);
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinerror, setPinError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [name, setName] = useState("");
  // const [address, setAddress] = useState("");
  const [contact, setContact] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any, endPoint: string) => {
    e.preventDefault();
    let body;
    if (active == 0) {
      body = { email };
    } else if (active == 1) {
      body = { email, otp: pin };
    } else if (active == 2) {
      body = {
        email,
        name: name,
        otp: pin,
        contact,
        password,
        confirmPassword,
      }
    }

    try {
      setLoading(true);

      const resp = await axiosPrivateInstance.post(endPoint, body, {
        headers: {
          Accept: "application/json",
        },
        params: {
          authPurpose: true,
        },
      });

      if (active === 0 && resp.status == 201) {
        setActive((current) => (current < 3 ? current + 1 : current));
      } else if (active === 1 && resp.data == false) {
        setPinError(true);
      } else if (active === 1 && resp.data == true) {
        setActive((current) => (current < 3 ? current + 1 : current));
      } else if (active === 2 && resp.status == 201) {
        setActive((current) => (current < 3 ? current + 1 : current));
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setEmailError(true);
      }
      console.log(error);
      // handleError(+error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  // Form Validation
  useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      pin: "",
      name: "",
      address: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) =>
        !value.trim()
          ? "Email is required"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email",
      pin: (value) => (!value.trim() ? "Pin is required" : null),
      name: (value) =>
        !value.trim()
          ? "Name is required"
          : value.length < 2
          ? "Name must have at least 2 letters"
          : null,
      address: (value) => (!value.trim() ? "Address is required" : null),
      phoneNumber: (value) =>
        !value.trim() ? "Phone number is required" : null,
      password: (value) => (!value.trim() ? "Password is required" : null),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handlePassword = (e: any) => {
    setConfirmPassword(e.target.value);
    const cpassword = e.target.value;
    if (password != cpassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  return (
    <form>
      <Group justify="center" gap={0}>
        <Center h={540}>
          <Paper h={398} w={{ lg: "auto", sm: "300" }} p={16} withBorder>
            <Stepper
              size="xs"
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
            >
              <Stepper.Step
                label="First step"
                description="Create an account"
                disabled={true}
              >
                <Flex justify={"center"}>
                  <Paper w={{ lg: "400", sm: "300" }} h={200} p={16}>
                    <Flex direction="column">
                      <Group gap={8}>
                        <Image w={20} src="img/icon.png" />
                        <Title c="#6092FE" size="h2">
                          Health Camp
                        </Title>
                      </Group>
                      <Title mt={30} size="h3">
                        Signup
                      </Title>
                      <Text mt={5} c="#969696">
                        Please login to continue with your account.
                      </Text>
                      <TextInput
                        error={emailError}
                        mt={20}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailError && (
                        <Text mt={10} size="xs" c="red">
                          Email Already Exist
                        </Text>
                      )}
                      <Button
                        loading={loading}
                        onClick={(e) => handleSubmit(e, generateOTPForAuth)}
                        type="submit"
                        mt={20}
                      >
                        Sign up
                      </Button>
                    </Flex>
                  </Paper>
                </Flex>
              </Stepper.Step>

              <Stepper.Step
                label="Second step"
                description="Verify email"
                disabled={true}
              >
                <Flex justify={"center"}>
                  <Paper w={{ lg: "400", sm: "300" }} h={200} p={16}>
                    <Flex direction="column">
                      <Group gap={8}>
                        <Image w={20} src="img/icon.png" />
                        <Title c="#6092FE" size="h2">
                          Health Camp
                        </Title>
                      </Group>
                      <Title mt={30} size="h3">
                        Enter Your Pin
                      </Title>
                      <Text mt={5} c="#969696">
                        Please enter the PIN sent to your email.
                      </Text>
                      <PinInput
                        error={pinerror}
                        onChange={(e: any) => setPin(e)}
                        length={6}
                        mt={10}
                      />
                      <Button
                        loading={loading}
                        onClick={(e) => handleSubmit(e, verifyOTP)}
                        type="submit"
                        mt={20}
                      >
                        Confirm
                      </Button>
                    </Flex>
                  </Paper>
                </Flex>
              </Stepper.Step>

              <Stepper.Step
                label="Final step"
                description="Get full access"
                disabled={true}
              >
                <Flex justify={"center"}>
                  <ScrollArea h={300}>
                    <Paper w={{ lg: "400", sm: "300" }} p={16}>
                      <Flex direction="column">
                        <Group gap={8}>
                          <Image w={20} src="img/icon.png" />
                          <Title mt={5} c="#6092FE" size="h2">
                            Health Camp
                          </Title>
                        </Group>
                        <Title mt={30} size="h3" c="#16CA06">
                          Email verification Successful!
                        </Title>
                        <Text size="sm" c="#969696">
                          You're just one step behind. Please enter your
                          details.
                        </Text>
                        <TextInput
                          onChange={(e) => setName(e.target.value)}
                          mt={20}
                          placeholder="Organization Name"
                        />
                        {/* <TextInput
                          onChange={(e) => setAddress(e.target.value)}
                          mt={20}
                          placeholder="Organization Address"
                        /> */}
                        <NumberInput
                          onChange={(e: any) => setContact(e)}
                          hideControls
                          mt={20}
                          placeholder="Phone Number"
                        />
                        <PasswordInput
                          onChange={(e) => setPassword(e.target.value)}
                          mt={20}
                          placeholder="Password"
                          type="password"
                        />

                        <PasswordInput
                          // onChange={(e) => setConfirmPassword(e.target.value)}
                          onChange={(e) => handlePassword(e)}
                          error={passwordError}
                          mt={20}
                          placeholder="Confirm Password"
                          type="password"
                        />
                        <Button
                          loading={loading}
                          onClick={(e) => handleSubmit(e, registerCliet)}
                          type="submit"
                          mt={20}
                        >
                          Signup
                        </Button>
                      </Flex>
                    </Paper>
                  </ScrollArea>
                </Flex>
              </Stepper.Step>

              <Stepper.Completed>
                <Space h="xl" />
                <Flex align="center" direction="column">
                  <Image w={100} src="icon/correct.png" />
                  <Text mt={10}>Congratulations, You are Registerd</Text>
                  <Button
                    variant="default"
                    onClick={() => navigate("/login")}
                    mt={10}
                  >
                    Login
                  </Button>
                </Flex>
              </Stepper.Completed>
            </Stepper>
          </Paper>
        </Center>
      </Group>
    </form>
  );
}

export default Login;
4;
