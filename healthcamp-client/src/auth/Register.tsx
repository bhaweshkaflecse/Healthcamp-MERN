import {
  TextInput,
  Button,
  Paper,
  Flex,
  Group,
  Center,
  Title,
  Image,
  Text,
  NumberInput,
  PinInput,
  PasswordInput,
  Stepper,
  Space,
} from "@mantine/core";
import { useState } from "react";
import api from "../api";
import { generateOTP, registerCliet, verifyOTP } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [active, setActive] = useState(0);
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinerror, setPinError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, endPoint: string) => {
    e.preventDefault();
    let body;

    if (active === 0) {
      body = { email };
    } else if (active === 1) {
      body = { email, otp: pin };
    } else if (active === 2) {
      // ✅ Contact validation
      if (!contact || contact <= 0 || contact.toString().length < 7) {
        toast.error("Phone number is not valid");
        return;
      }

      body = {
        email,
        pin,
        otp: pin,
        contact,
        name,
        primaryLevelParticipant: 0,
        midLevelParticipant: 0,
        higherLevelParticipant: 0,
        password,
        confirmPassword,
        address,
      };
    }

    if (passwordError) {
      toast.error("Password doesn't match");
      return;
    }

    try {
      setLoading(true);
      const resp = await api.post(endPoint, body, {
        headers: { Accept: "application/json" },
      });

      if (active === 0 && resp.status === 201) {
        setActive((current) => (current < 3 ? current + 1 : current));
      } else if (active === 1 && resp.data === false) {
        setPinError(true);
      } else if (active === 1 && resp.data === true) {
        setActive((current) => (current < 3 ? current + 1 : current));
      } else if (active === 2 && resp.status === 201) {
        setActive((current) => (current < 3 ? current + 1 : current));
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setEmailError(true);
      }

      if (Array.isArray(error?.response?.data?.message)) {
        error.response.data.message?.map((item: any) => toast.error(item));
      } else {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        handleSubmit(
          e,
          active === 0 ? generateOTP : active === 1 ? verifyOTP : registerCliet
        )
      }
    >
      <Group justify="center" mt={80} gap={0}>
        <Center>
          <Paper
            mih={400}
            h="auto"
            w={{ lg: "auto", sm: "300" }}
            p={16}
            withBorder
          >
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
                        onClick={(e) => handleSubmit(e, generateOTP)}
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
                        onChange={(value: string) => setPin(value)}
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
                  {/* <ScrollArea h={300}> */}
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
                        You're just one step behind. Please enter your details.
                      </Text>
                      <TextInput
                        onChange={(e) => setName(e.target.value)}
                        mt={20}
                        placeholder="Organization Name"
                      />
                      <NumberInput
                        value={contact ?? ""}
                        onChange={(val) => {
                          if (typeof val === "number") {
                            setContact(val);
                          } else {
                            setContact(null); // if empty or invalid
                          }
                        }}
                        hideControls
                        mt={20}
                        placeholder="Phone Number"
                        min={0} // prevents negative numbers
                      />

                      <TextInput
                        onChange={(e) => setAddress(e.target.value)}
                        mt={20}
                        placeholder="Address"
                      />
                      <PasswordInput
                        onChange={(e) => setPassword(e.target.value)}
                        mt={20}
                        placeholder="Password"
                        type="password"
                      />

                      <PasswordInput
                        onChange={handlePasswordChange}
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
                  {/* </ScrollArea> */}
                </Flex>
              </Stepper.Step>
              <Stepper.Completed>
                <Space h="xl" />
                <Flex align="center" direction="column">
                  <Image w={60} src="img/correct.png" />
                  <Text mt={10}>Congratulations, You are Registered</Text>
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
        <Image visibleFrom="sm" radius={5} w={400} src={"img/health.png"} />
      </Group>
    </form>
  );
}

export default Register;
