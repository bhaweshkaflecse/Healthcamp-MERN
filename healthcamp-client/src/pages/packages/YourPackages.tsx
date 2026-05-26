import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { paymentEnrollmentAPI } from "../../api/package";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const YourPackages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, price } = location.state || {};

  const [total, setTotal] = useState<string | number>(0);
  const [participants, setParticipants] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  interface FormData {
    document: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    document: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    const file = files[0];
    setFormData({
      ...formData,
      document: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const calculate = (e: number) => {
    setParticipants(e);
    const result = price.map((item: any) => {
      return e <= item.max && e >= item.min ? item.price : null;
    });
    const result2 = result.filter((item: any) => item !== null);
    if (!result2.length) {
      setTotal("Out of price range");
      return;
    }
    setTotal(result2[0] * e);
  };

  const data1 = {
    participant: participants,
    price: total,
    medium: paymentMethod,
    proof: formData.document,
  };

  const purchaseDetails = async () => {
    const resp = await axiosPrivateInstance.post(
      `${paymentEnrollmentAPI}/${id}`,
      data1,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["uploadPaymentDetails"],
    mutationFn: purchaseDetails,
    onError: (error: any) => {
      const messages = error?.response?.data?.message;

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error(messages);
      }
    },
    onSuccess: () => {
      toast.success("Package has been purchased successfully");
      navigate('/dashboard')
    },
  });

  function BaseDemo(props: Partial<DropzoneProps>) {
    return (
      <Dropzone
        onDrop={(files) => handleFile(files)}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          {preview ? (
            <Image w={200} fit="cover" src={preview} />
          ) : (
            <Box>
              <div>
                <Text size="xl" inline>
                  Payment Proof
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Upload the screenshot of payment. Supports: JPG, PNG
                </Text>
              </div>
            </Box>
          )}
        </Group>
      </Dropzone>
    );
  }

  return (
    <Box>
      <Title>Your Package</Title>

      <Flex justify="end">
        <Button
          variant="transparent"
          c="#000000"
          my={40}
          style={{ textDecoration: "underline" }}
        >
          Change Plan
        </Button>
      </Flex>

      <Paper withBorder>
        <Box p="xs" bg="blue">
          <Text c="#ffffff" ta="center">
            PAYMENT
          </Text>
        </Box>
        <Box p="xl">
          <Text ta="center">
            To ensure clarity regarding the prices amount, refer to the price
            description included in the package information.
          </Text>

          <Divider my="lg" />

          <Flex justify="space-between">
            <Text>Enter No. of participants</Text>
            <NumberInput onChange={(e: any) => calculate(e)} />
          </Flex>

          <Divider my="lg" />

          <Flex justify="space-between">
            <Text fw="bold">Total Amount</Text>
            <Text fw="bold">Rs. {total}</Text>
          </Flex>
        </Box>
      </Paper>

      <Paper withBorder my={20}>
        <Flex justify="space-around" my={20}>
          <Paper withBorder>
            <Box p="xs" bg="blue">
              <Text c="#ffffff" ta="center">
                Payment Mode 1
              </Text>
            </Box>
            <Flex direction="column" align="center" p="xl">
              <Text ta="center">Pay via Mobile Banking</Text>
              <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" />

              <Text ta="center">
                Nabil Bank QR
                <Text size="xs" c="dimmed" ta="center">
                  Scan above QR for payment
                </Text>
              </Text>
            </Flex>
          </Paper>

          <Paper withBorder>
            <Box p="xs" bg="blue">
              <Text c="#ffffff" ta="center">
                Payment Mode 2
              </Text>
            </Box>
            <Flex direction="column" align="center" p="xl">
              <Text ta="center">Pay via Mobile Banking</Text>
              <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" />

              <Text ta="center">
                Nabil Bank QR
                <Text size="xs" c="dimmed" ta="center">
                  Scan above QR for payment
                </Text>
              </Text>
            </Flex>
          </Paper>
        </Flex>
      </Paper>

      <Divider h={20} />

      <Paper withBorder p={20}>
        <Text my={30}>Payment Details</Text>

        <TextInput disabled my={20} value={total} />

        <Select
          value={paymentMethod}
          searchable
          data={["esewa"]}
          onChange={(value: any) => setPaymentMethod(value)}
          placeholder="Payment Mode"
        />

        <BaseDemo my={20} />
        <Flex justify="end" gap="xs">
          <Button variant="default">Cancel</Button>
          <Button loading={isPending} onClick={() => mutate()} bg="btncolor.0">
            Submit
          </Button>
        </Flex>
      </Paper>

      <Center my={20}>
        <Button onClick={() => navigate("/dashboard")} variant="default">
          Back to Dashboard
        </Button>
      </Center>
    </Box>
  );
};

export default YourPackages;
