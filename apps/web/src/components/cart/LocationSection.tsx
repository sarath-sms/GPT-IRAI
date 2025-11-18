import styled from "styled-components";
import { motion } from "framer-motion";
import MapPreview from "../MapPreview";

const Button = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
`;

export default function LocationSection({ geo, onGetLocation }: any) {
  return (
    <>
      {!geo ? (
        <Button whileTap={{ scale: 0.98 }} onClick={onGetLocation}>
          Get Current Location
        </Button>
      ) : (
        <MapPreview geo={geo} />
      )}
    </>
  );
}
