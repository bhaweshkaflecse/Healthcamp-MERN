import { Button, Input, Paper, Select, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { postCallCenterDetailsAPI } from "../../api/callcenter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";
import { useNavigate } from "react-router-dom";

const DataLog = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      organizationName: "",
      phoneNumber: "",
      reason:"",
      callType: "",
      description:""
    },

    validate: {
      organizationName: (value) =>
      value ? null : "Please enter organization name",
      phoneNumber: (value) => (value ? null : "Please enter your Phone Number"),
      callType: (value) => (value ? null : "Please select call Type"),
      reason:(value) => (value ? null : "Please specify reason Type"),
      description:(value) => (value ? null : "Please add a description"),
    },
  });

  const details = {
    name: form.getValues().organizationName,
    contact: +form.getValues().phoneNumber,
    callType: form.getValues().callType,
    reason: form.getValues().reason,
    description: form.getValues().description
  };

  const postCallDetails = async () => {
    const resp = await axiosPrivateInstance.post(
      postCallCenterDetailsAPI,
      details
    );
    return resp.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["postCalls"],
    mutationFn: postCallDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCallsDetails"] }),
        toast.success("Added Successfully!");
      navigate("/call-center");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Error Occurred");
      console.log(err);
    },
  });

  const handleSubmit = (values: any) => {
    console.log('WHAT THE FUCK')
    mutate(values);
  };

  console.log(form.getValues());

  return (
    <>
      <Title size="h2" c="primary.0">
        Add Call Log
      </Title>
      <Paper mt={10} p={20} withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            placeholder="Name of Organization or Full Name "
            {...form.getInputProps("organizationName")}
          />
          <Input
            mt={20}
            type="number"
            placeholder="Phone Number"
            {...form.getInputProps("phoneNumber")}
          />
          <Select
            placeholder="Select Request Type "
            {...form.getInputProps("callType")}
            mt={20}
            data={["outgoing", "incoming"]}
          />


          <Textarea {...form.getInputProps('description')} mt={20} placeholder="Add a description" />

          <Select {...form.getInputProps("reason")} mt={20}  data={["lead","query", "service"]} placeholder="Select Lead Type" />
          <Button loading={isPending} mt={20} type="submit">
            Submit
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default DataLog;
