import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PageLoader = () => {
  return (
    <>
      <div className="flex justify-center items-center h-44">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2xl"
          style={{ color: "#011def" }}
        />
        <p>Loading....</p>
      </div>
    </>
  );
};
