import { useParams } from "react-router-dom";

export const Attempt = () => {
  let { id } = useParams();

  return `Attempt ${id}`;
};
