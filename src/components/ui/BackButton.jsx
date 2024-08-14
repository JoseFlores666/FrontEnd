import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center text-black-500  hover:text-gray-900 focus:outline-none"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="w-7 h-7 " />
    </button>
  );
};