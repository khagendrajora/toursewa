import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ButtonLoader = () => {
  return (
    <>
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        size="xl"
        style={{ color: "#04fa00", padding: "2px" }}
      />
    </>
  );
};
