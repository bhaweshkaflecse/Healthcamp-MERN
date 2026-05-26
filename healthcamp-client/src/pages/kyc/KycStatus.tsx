import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { CiCircleAlert } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { clientinfo } from "../../api/auth";
import { axiosPrivateInstance } from "../../api";
import ErrorAxios from "../../components/ErrorAxios";

const KycStatus = () => {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery({
    queryKey: ["KycPending"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(clientinfo);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    )
  }
  if (error) {
    <ErrorAxios error={error} fallbackMessage="An error occurred" />;
  }

  const icon = <CiCircleAlert size={20} />;
  return (
    <>
      <Box p={10}>
        <Group justify="space-between">
          <Title c="#6092FE" size="h2">
            KYC STATUS
            {
              !data?.kyc?.kycStatus ? (
                <Badge color={'yellow'}>
                  KYC not filled
                </Badge>
              ) : <Badge color={data?.kyc?.kycStatus === "approved" ? "green" : "red"}>
                {data?.kyc?.kycStatus}
              </Badge>
            }

          </Title>
          <Button
            onClick={() => navigate("/kyc-details")}
            mt={10}
            color="#6092FE"
          >
            View Status
          </Button>
        </Group>

        {data?.kyc?.comment && (
          <Alert
            mt={20}
            variant="light"
            color="red"
            title="KYC has been denied. Please re-initiate the process"
            icon={icon}
          >
            <Text c='dimmed'>
              {data?.kyc?.comment}
            </Text>
          </Alert>
        )}

        <Paper withBorder p={10} mt={20}>
          <Title size="h3">Verify Kyc</Title>
          <Text c={"dimmed"} size="sm">
            Please Verify Kyc to Get Full Access to all the Health Camp
            Services.
          </Text>
          <Button
            disabled={
              data?.kyc.kycStatus === "pending" ||
              data?.kyc.kycStatus === "approved"
            }
            onClick={() => navigate("/kyc")}
            mt={10}
            color="#6092FE"
          >
            Initiate KYC Verification
          </Button>
        </Paper>
        <Center>
          <Button
            onClick={() => navigate("/dashboard")}
            mt={20}
            color="#4CAF50"
          >
            Back to Dashboard
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default KycStatus;
