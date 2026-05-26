import {
  Button,
  Center,
  Flex,
  NumberInput,
  Paper,
  PasswordInput,
  Select,
  Space,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createrole, createTechnicalMember } from "../../../api/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roledata } from "../rough/Rough";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../../api";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { RiUpload2Line } from "react-icons/ri";
import { getServices } from "../../../api/service";

interface FormData {
  document: File | null;
}

const AssignMember = () => {
  const notify = () => toast.success("Role has been created successfully!");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<FormData>({
    document: null,
  });
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [checkedRole, setCheckedRole] = useState<number | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["serviceList"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(getServices);
      return response.data;
    },
  });

  console.log("Service data:", data);

  const servicesOptions =
    data?.servicesWithCalendarStatus?.map((service: any) => ({
      value: service.id,
      label: service.name,
    })) || [];

  const handleSubmit = async () => {
    const selectedRole = roledata.find((item) => item.id === checkedRole);
    const body = {
      name,
      email,
      contact,
      address,
      password,
      profile: formData.document,
      department: selectedRole?.value,
      serviceId, // ✅ Add serviceId to the payload if needed
    };

    if (
      !body.name ||
      !body.email ||
      !body.contact ||
      !body.address ||
      !body.password ||
      !body.department
    ) {
      throw Error("Please fill up all the details");
    }

    if (body.password.length <= 6) {
      throw Error("Password must be at least 6 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw Error("Email is invalid");
    }

    const contactString = body.contact.toString();
    if (!/^\d{10}$/.test(contactString)) {
      throw Error("Contact number must be exactly 10 digits");
    }

    try {
      const resp = await axiosPrivateInstance.post(createrole, body, {});
      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateTechnicalMember = async () => {
    if (!name || !email || !contact || !address || !formData.document) {
      throw Error("Please fill all technical member details");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw Error("Invalid email");
    }

    if (!/^\d{10}$/.test(contact.toString())) {
      throw Error("Contact must be 10 digits");
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("contact", contact.toString());
    payload.append("address", address);
    payload.append("profile", formData.document);

    // ✅ Add serviceId if needed for technical members
    if (serviceId) {
      payload.append("serviceId", serviceId);
    }

    const resp = await axiosPrivateInstance.post(
      createTechnicalMember,
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return resp.data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["memberList"],
        refetchType: "active",
        exact: true,
      });
      notify();
      console.log(data);
      navigate("/role");
    },
    onError: (error: any) => {
      toast.error(error?.message || error?.response?.data?.message);
    },
  });

  const { isPending: isTechnicalPending, mutate: mutateTechnical } =
    useMutation({
      mutationFn: handleCreateTechnicalMember,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["memberList"] });
        notify();
        navigate("/role");
      },
      onError: (error: any) => {
        toast.error(error?.message || error?.response?.data?.message);
      },
    });

  return (
    <>
      <Title size="h2" c="#6092FE">
        Role Management
      </Title>
      <Paper mt={10} p={18} withBorder lh={2.5}>
        <Title size="h4">Assign Staff</Title>
        <Text mt={20} fw={500} ta="center">
          Select the role you are assigning for your member
        </Text>
        <Center>
          <Paper mt={10} w={450} p={20} withBorder>
            {roledata?.map((item) => (
              <Flex key={item.id} justify="space-between">
                <p>{item.name}</p>
                <Switch
                  checked={checkedRole === item.id}
                  onChange={(e) =>
                    setCheckedRole(e.target.checked ? item.id : null)
                  }
                />
              </Flex>
            ))}
          </Paper>
        </Center>
      </Paper>
      <Paper p={10} withBorder mt={10} lh={2.5}>
        <Space h={"lg"} />
        <Paper p={18} withBorder lh={2.5}>
          <Flex direction="column" gap={20}>
            <Title size="h4">
              {checkedRole
                ? `${roledata.find((r) => r.id === checkedRole)?.name} Info`
                : "Info"}
            </Title>

            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              withAsterisk
              placeholder="First Name *"
            />
            <TextInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              withAsterisk
            />
            <NumberInput
              value={contact ?? undefined}
              onChange={(value) => setContact(+value)}
              placeholder="Phone Number *"
              hideControls
              maxLength={10}
              withAsterisk
            />
            {checkedRole !== 1 && (
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password *"
                minLength={6}
                withAsterisk
              />
            )}

            <TextInput
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address *"
              withAsterisk
            />
            {checkedRole === 1 && (
              <Select
                placeholder="Select Service"
                value={serviceId}
                onChange={setServiceId}
                data={servicesOptions}
                searchable
                clearable
                disabled={isLoading}
                nothingFoundMessage="No services available"
              />
            )}
          </Flex>

          {checkedRole === 1 && (
            <Dropzone
              onDrop={(files) =>
                setFormData((prev) => ({ ...prev, document: files[0] }))
              }
              maxSize={5 * 1024 ** 2}
              accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
            >
              <Paper
                withBorder
                maw={350}
                p={20}
                style={{
                  marginTop: 20,
                  justifyItems: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <div>
                  <RiUpload2Line size={40} />
                </div>
                <Flex direction="column" align="center">
                  <Text ta="center" mt={10}>
                    Upload Profile Image
                  </Text>
                  <Text ta="center" mt={5} c="dimmed" fz="sm">
                    Supports: JPEG, PNG
                  </Text>
                  <Button
                    style={{ cursor: "pointer" }}
                    variant="default"
                    mt={5}
                    c={"green"}
                  >
                    Choose a File
                  </Button>
                  {formData.document && (
                    <Text mt={5} fz="sm" c="green">
                      ✓ {formData.document.name}
                    </Text>
                  )}
                </Flex>
              </Paper>
            </Dropzone>
          )}
        </Paper>
        <Space h="lg" />
        <Flex justify={"center"} gap={10}>
          <Button
            loading={checkedRole === 1 ? isTechnicalPending : isPending}
            onClick={() => (checkedRole === 1 ? mutateTechnical() : mutate())}
            color="green"
          >
            Save
          </Button>
        </Flex>
      </Paper>
    </>
  );
};

export default AssignMember;
