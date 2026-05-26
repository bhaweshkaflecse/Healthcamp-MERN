import { useMediaQuery } from "@mantine/hooks";

export const getMyScreenSize = () => {
  const width1 = useMediaQuery("(min-width: 1100px)");
  const width2 = useMediaQuery("(min-width: 512px)");
  if (width1) {
    return "lg";
  } else if (width2) {
    return "md";
  }
 return"sm";
};