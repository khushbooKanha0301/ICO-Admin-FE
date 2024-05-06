import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import jwtAxios from "../service/jwtAxios";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DigitInput = styled.input`
  width: 30px;
  height: 30px;
  font-size: 16px;
  text-align: center;
  border: none;
  border-bottom: 2px solid #000;
  margin: 0 5px;
  outline: none;
`;

//This component is used for forget pass OTP
const ForgotPasswordOTP = (props) => {
  const [secret, setSecret] = useState("");
  const [otpValue, setOTPValue] = useState("");
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [numIndex, setNumIndex] = useState("");
  const [lastAttemptTime, setLastAttemptTime] = useState("");
  const [invalidAttempts, setInvalidAttempts] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (numIndex === 5 && otpValue.length === 6) {
      makeAPICall();
    }
  }, [numIndex, otpValue]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otpValue[index]) {
      e.preventDefault();
      setOTPValue((prevOTP) => {
        const updatedOTP = [...prevOTP];
        updatedOTP[index - 1] = "";
        return updatedOTP.join("");
      });
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOTPValue((prevOTP) => {
      const updatedOTP = [...prevOTP];
      updatedOTP[index] = value.charAt(value.length - 1);
      return updatedOTP.join("");
    });
    setNumIndex(index);
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const makeAPICall = async () => {
    if (!otpValue) {
      dispatch(notificationFail("Please Enter Code"));
    } else {
      if (otpValue.length !== 6) {
        dispatch(notificationFail("Please Enter Valid Code"));
      } else {
        const now = new Date().getTime();
        const invalidAttempts1 = Number(invalidAttempts) || 0;
        const lastAttemptTime1 = Number(lastAttemptTime) || 0;

        if (invalidAttempts1 >= 3 && now - lastAttemptTime1 < 5 * 60 * 1000) {
          dispatch(notificationFail("You can try again after 5 minutes"));
          setTimeout(() => {
            setLastAttemptTime("");
            setError("");
            inputRefs.current[0]?.focus();
          }, 300000);
          setError("You can try again after 5 minutes");
          setOTPValue("");
          inputRefs.current[0]?.focus();
          return;
        }

        await jwtAxios
          .post("/auth/checkOTP", { otp: otpValue, email: props.email })
          .then((res) => {
            props.onClose();
            dispatch(notificationSuccess(res.data?.message));
            navigate("/reset-password", { state: { email: props.email } });
          })
          .catch(() => {
            if (now - lastAttemptTime1 >= 5 * 60 * 1000) {
              setInvalidAttempts(1);
              setLastAttemptTime(now);
            } else {
              setInvalidAttempts(invalidAttempts1 + 1);
            }
            dispatch(notificationFail("Invalid OTP"));
            setOTPValue("");
            inputRefs.current[0]?.focus();
          });
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedOTP = e.clipboardData.getData("text/plain");
    if (/^\d+$/.test(pastedOTP) && pastedOTP.length <= 6) {
      const updatedOTP = pastedOTP.slice(0, 6).split("");
      const initialOTP = Array.from({ length: 6 }, (_, index) =>
        index < updatedOTP.length ? updatedOTP[index] : ""
      );
      setOTPValue(initialOTP.join(""));
      setNumIndex(updatedOTP.length - 1);
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <Modal
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
      show={props.isOpen}
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Enter OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        {secret && (
          <p style={{ marginBottom: "20px" }}>
            Secret Key: <span className="secret-key">{secret}</span>
          </p>
        )}
        {Array.from({ length: 6 }, (_, index) => (
          <DigitInput
            key={index}
            type="text"
            value={otpValue[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e)}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="digit-input"
            disabled={error}
          />
        ))}
        <br />
        {error && (
          <p style={{ color: "#f76161", marginTop: "10px" }}>{error}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordOTP;
