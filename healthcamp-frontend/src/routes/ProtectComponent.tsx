import PropTypes from "prop-types";
import useAuthStore from "../providers/context/useAuthStore";
import { Box, Text } from "@mantine/core";

const ProtectComponent = ({ children, requiredPermission }: any) => {
  const { role } = useAuthStore();

  // Non-staff roles can access unconditionally
  if (requiredPermission.includes(role)) {
    return children;
  }

  // Block access by default
  return (
    <Box>
      <Text>Unauthorised</Text>
    </Box>
  );
};

ProtectComponent.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
};

export default ProtectComponent;
