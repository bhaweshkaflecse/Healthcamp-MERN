import { useState, useEffect } from "react";
import {
  Stepper,
  Button,
  Group,
  Paper,
  Text,
  Box,
  TextInput,
  Flex,
  Select,
  Checkbox,
  Image,
  ActionIcon,
} from "@mantine/core";
import "@mantine/dropzone/styles.css";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import api, { axiosPrivateInstance } from "../../api";
import { updatekyc } from "../../api/kyc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGlobalContext from "../../providers/context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clientinfo, getDistrict, getNepalProvince } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";

interface FormData {
  organization: string;
  streetAddress: string;
  email: string;
  contact: number | string;
  documentType: string;
  province: string;
  documents: File[];
  district: string;
  city: string;
}

interface Province {
  id: number;
  name: string;
}

const KycApprove = (props: Partial<DropzoneProps>) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { generateAcessToken } = useGlobalContext();
  const [previewUrl, setPreviewUrl] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const [privacyCheck, setPrivacyCheck] = useState<boolean>(false);
  const [provinceOptions, setProvinceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [districtOptions, setDistrictOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");

  const form = useForm({
    initialValues: {
      province: "",
      city: "",
      streetAddress: "",
      documentType: "",
      district: "",
      privacyCheck: false,
    },
    validate: {
      province: (value) => (value ? null : "Please enter your state"),
      city: (value) => (value ? null : "Please enter your city"),
      streetAddress: (value) =>
        value ? null : "Please enter your street address",
      privacyCheck: (value) =>
        value ? null : "You must agree to the terms and conditions",
      documentType: (value) => (value ? null : "Please mention document type"),
      district: (value) => (value ? null : "Please enter your district"),
    },
  });

  const privacyCheckFunc = () => {
    setPrivacyCheck(!privacyCheck);
    form.setFieldValue("privacyCheck", !privacyCheck);
  };

  // Fetch client information
  const { isLoading, data: clientData } = useQuery({
    queryKey: ["packageList"],
    queryFn: async () => {
      const token = await generateAcessToken();
      const response = await api.get(clientinfo, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
  });

  // Fetch province data
  const { data: provinceData, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinceList"],
    queryFn: async () => {
      const token = await generateAcessToken();
      const response = await api.get(getNepalProvince, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    },
  });

  // Format province data when it's available
  useEffect(() => {
    if (provinceData && Array.isArray(provinceData)) {
      const options = provinceData.map((province: Province) => ({
        value: String(province.id),
        label: province.name,
      }));
      setProvinceOptions(options);
    }
  }, [provinceData]);

  // Fetch district data based on selected province
  const fetchDistricts = async (provinceId: string) => {
    if (!provinceId) {
      setDistrictOptions([]);
      return;
    }

    try {
      const token = await generateAcessToken();
      const response = await api.get(`${getDistrict}/${provinceId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        // Handle both object format and string array format
        const options = response.data
          .map((district: any, index: number) => {
            // Check if district is an object with id and name properties
            if (typeof district === "object" && district !== null) {
              return {
                value: String(district.id),
                label: district.name,
              };
            }
            // Handle case where district is a string
            else if (typeof district === "string") {
              return {
                value: String(index), // Use index as value since we don't have an ID
                label: district,
              };
            }
            return null;
          })
          .filter(Boolean); // Remove any null values
        //@ts-ignore
        setDistrictOptions(options);
      } else {
        setDistrictOptions([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistrictOptions([]);
      toast.error("Failed to load districts");
    }
  };

  // Effect to fetch districts when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      fetchDistricts(selectedProvinceId);
      // Reset district selection when province changes
      form.setFieldValue("district", "");
    } else {
      setDistrictOptions([]);
    }
  }, [selectedProvinceId]);

  const [formData, setFormData] = useState<FormData>({
    organization: "",
    streetAddress: "",
    email: "",
    province: "",
    contact: "",
    documentType: "",
    documents: [],
    district: "",
    city: "",
  });

  // Guard: redirect away if KYC already submitted or approved
  useEffect(() => {
    if (clientData) {
      const kycStatus = clientData?.kyc?.kycStatus;
      if (kycStatus === "pending" || kycStatus === "approved") {
        navigate("/kyc-details");
      }
    }
  }, [clientData, navigate]);

  // Initialize form data with client data
  useEffect(() => {
    if (clientData) {
      setFormData((prev) => ({
        ...prev,
        organization: clientData.name || "",
        email: clientData.email || "",
        contact: clientData.contact || "",
      }));
    }
  }, [clientData]);

  // Update formData when form values change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      province: form.values.province,
      district: form.values.district,
      streetAddress: form.values.streetAddress,
      documentType: form.values.documentType,
      city: form.values.city,
    }));
  }, [form.values]);

  const handleDocumentUpload = (files: File[]) => {
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));

      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrl((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Function to remove a specific image
  const removeImage = (indexToRemove: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewUrl[indexToRemove]);
    
    // Remove the preview URL
    setPreviewUrl((prev) => prev.filter((_, index) => index !== indexToRemove));
    
    // Remove the corresponding file from formData
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Modified handleSubmit function to send province and district names
  const handleSubmit = async (values: FormData): Promise<any> => {
    try {
      const submitData = new FormData();
      submitData.append("organization", values.organization);
      submitData.append("streetAddress", values.streetAddress);
      submitData.append("email", values.email);
      submitData.append("documentType", values.documentType);

      // Get province name from ID
      const provinceName = getProvinceName(values.province);
      submitData.append("province", provinceName);

      // Get district name from ID
      const districtName = getDistrictName(values.district);
      submitData.append("district", districtName);

      submitData.append("city", values.city);

      values.documents.forEach((file) => {
        submitData.append("documents", file);
      });

      const resp = await axiosPrivateInstance.patch(updatekyc, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return resp.data;
    } catch (error: any) {
      throw error;
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      navigate("/kycstatus", { state: clientData });
      queryClient.invalidateQueries({
        queryKey: ["KycPending"],
        refetchType: "active",
        exact: true,
      });
      return toast.success("KYC is updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const nextStep = () => {
    if (!privacyCheck && active === 0) {
      toast.error("Please approve our terms and conditions");
      return;
    }

    const errors = form.validate();
    if (errors.hasErrors && active === 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (formData.documents.length === 0 && active === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    if (active === 1) {
      mutate(formData);
    } else {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  // Get province name based on ID
  const getProvinceName = (id: string) => {
    if (!id) return "-";
    const province = provinceOptions.find((p) => p.value === id);
    return province ? province.label : "-";
  };

  // Get district name based on ID
  const getDistrictName = (id: string) => {
    if (!id) return "-";
    const district = districtOptions.find((d) => d.value === id);
    return district ? district.label : "-";
  };

  if (isLoading || isLoadingProvinces) {
    return <div>Loading...</div>;
  }

  if (clientData?.kyc?.kycStatus === "pending" || clientData?.kyc?.kycStatus === "approved") {
    return null;
  }

  const documentTypeOptions = [
    { value: "citizenship", label: "Citizenship" },
    { value: "passport", label: "Passport" },
    { value: "pan", label: "PAN" },
  ];

  return (
    <>
      <Box bg="#6092FE" h={35}></Box>
      <form onSubmit={(e) => e.preventDefault()}>
        <Paper p={40}>
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              label="Organizational Details"
              description="in progress"
            >
              <Paper mt={10} p={10} withBorder>
                <Flex direction="column" gap={20}>
                  <Text fw={500}>Organization Details</Text>
                  <TextInput
                    disabled
                    value={clientData?.name}
                    name="organization"
                    placeholder="Full Name of Organization"
                  />
                  <TextInput
                    disabled
                    value={clientData?.email}
                    name="email"
                    placeholder="Enter Your Email"
                  />
                  <TextInput
                    disabled
                    value={clientData?.contact}
                    name="contact"
                    placeholder="Enter Your Contact"
                  />
                  <Select
                    label="Province/State"
                    placeholder="Select a province"
                    data={provinceOptions}
                    value={form.values.province}
                    onChange={(value) => {
                      if (value) {
                        form.setFieldValue("province", value);
                        setSelectedProvinceId(value);
                      }
                    }}
                    searchable
                    error={form.errors.province}
                  />
                  <Select
                    label="District"
                    placeholder="Select a district"
                    data={districtOptions}
                    value={form.values.district}
                    onChange={(value) =>
                      value && form.setFieldValue("district", value)
                    }
                    searchable
                    disabled={
                      !selectedProvinceId || districtOptions.length === 0
                    }
                    error={form.errors.district}
                  />
                  <TextInput
                    label="City"
                    placeholder="Enter your city"
                    value={form.values.city}
                    onChange={(e) => form.setFieldValue("city", e.target.value)}
                    error={form.errors.city}
                  />
                  <TextInput
                    label="Street Address"
                    placeholder="Enter your street address"
                    value={form.values.streetAddress}
                    onChange={(e) =>
                      form.setFieldValue("streetAddress", e.target.value)
                    }
                    error={form.errors.streetAddress}
                  />
                </Flex>
              </Paper>
              <Paper mt={30} p={10} withBorder>
                <Flex gap={20} direction="column">
                  <Text>Registration Document Details</Text>
                  <Select
                    label="Document Type"
                    placeholder="Select document type"
                    data={documentTypeOptions}
                    value={form.values.documentType}
                    onChange={(value) =>
                      value && form.setFieldValue("documentType", value)
                    }
                    error={form.errors.documentType}
                  />
                  <Text>Upload Registration Document Image</Text>
                  <Dropzone

                    onDrop={(file) => handleDocumentUpload(file)}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    {...props}
                  >
                    {previewUrl.length > 0 ? (
                      <Group mt="md">
                        {previewUrl.map((url, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Image
                              src={url}
                              width={100}
                              height={100}
                              alt="Uploaded preview"
                            />
                            {/* Cross icon to remove image */}
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="filled"
                              style={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                borderRadius: "50%",
                              }}
                              onClick={() => removeImage(index)}
                            >
                              <IoIosCloseCircleOutline size={12} />
                            </ActionIcon>
                          </div>
                        ))}
                      </Group>
                    ) : (
                      <Paper withBorder p={10}>
                        <Flex
                          direction="column"
                          align="center"
                          justify="center"
                          gap="xl"
                          mih={220}
                          style={{ pointerEvents: "none" }}
                        >
                          <Box ta="center">
                            <Text size="xl" inline>
                              Image of Your Document
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                              upload the front side of your document supports:
                              JPG, PNG
                            </Text>
                            <Button color="#28A745" variant="outline" mt={10}>
                              Choose a file
                            </Button>
                          </Box>
                        </Flex>
                      </Paper>
                    )}
                  </Dropzone>
                  <Checkbox
                    onClick={privacyCheckFunc}
                    checked={privacyCheck}
                    label="I Confirm that I have uploaded valid government issued
                          documents. The documents include my organization details,
                          email, contact, address and valid registration document of
                          organization."
                  />
                </Flex>
              </Paper>
            </Stepper.Step>
            <Stepper.Step label="Review" description="Pending">
              <Paper p={10} withBorder>
                <Text fw={500}>Organizational Details</Text>
                <Group justify="space-between" mt={10}>
                  <Box>
                    <Text size="sm">Name of organization</Text>
                    <Text size="sm" c="#878787">
                      {clientData?.name || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">Email </Text>
                    <Text size="sm" c="#878787">
                      {clientData?.email || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">Contact </Text>
                    <Text size="sm" c="#878787">
                      {clientData?.contact || "-"}
                    </Text>
                  </Box>
                </Group>
                <Group mt={10} justify="space-between">
                  <Box>
                    <Text size="sm">Province/State</Text>
                    <Text size="sm" c="#878787">
                      {getProvinceName(form.values.province)}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">District</Text>
                    <Text size="sm" c="#878787">
                      {getDistrictName(form.values.district)}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">City</Text>
                    <Text size="sm" c="#878787">
                      {form.values.city || "-"}
                    </Text>
                  </Box>
                </Group>
                <Box mt={10}>
                  <Text size="sm">Street Address</Text>
                  <Text size="sm" c="#878787">
                    {form.values.streetAddress || "-"}
                  </Text>
                </Box>
                <Text mt={10} fw={500}>
                  Registration Document Details
                </Text>
                <Box mt={10}>
                  <Text size="sm">Document Type</Text>
                  <Text size="sm" c="#878787">
                    {form.values.documentType || "-"}
                  </Text>
                </Box>
                <Text mt={10} size="sm">
                  Registration Documents
                </Text>
                <Group gap="xs" mt={10}>
                  {previewUrl.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        width={200}
                        height={200}
                        src={url}
                        alt={`Preview ${index}`}
                      />
                      {/* Cross icon to remove image in review section */}
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          borderRadius: "50%",
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <IoIosCloseCircle size={12} />
                      </ActionIcon>
                    </div>
                  ))}
                </Group>
              </Paper>
            </Stepper.Step>
            <Stepper.Completed>
              <Paper bg="#E5ECFA" h={200} withBorder>
                <Flex gap={20} align="center" direction="column">
                  <Image
                    mt={10}
                    w={50}
                    src="icon/correct.png"
                    alt="Correct icon"
                  />
                  <Text>Registration Completed Successfully</Text>
                  <Text>
                    Thank you for registering! Your Organization details have
                    been successfully submitted.
                  </Text>
                </Flex>
              </Paper>
            </Stepper.Completed>
          </Stepper>
          <Group justify="flex-end" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Back
            </Button>
            <Button loading={isPending} onClick={nextStep} color="#4CAF50">
              Next
            </Button>
          </Group>
        </Paper>
      </form>
    </>
  );
};

export default KycApprove;