import listData from "./countryData";
import React, { forwardRef, useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../../src/store/slices/notificationSlice";
import jwtAxios from "../../src/service/jwtAxios";
import {
  defineCountry,
  definePhoneCode,
} from "../../src/store/slices/countrySettingSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CalenderIcon } from "./SVGIcon";
export const EditUserDetails = (props) => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [city, setCity] = useState(null);
  const [res_address, setResAddress] = useState(null);
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState(null);
  const [countryCallingCode, setCountryCallingCode] = useState(null);

  useEffect(() => {
    let user = props?.viewKYC?.user;
    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPhone(user?.phone ? user?.phone : "");
      setEmail(user?.email ? user?.email : "");
      setCity(user?.city ? user?.city : "");
      setResAddress(user?.res_address ? user?.res_address : "");
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : "");
      setLocation(user?.location ? user?.location : "");
    }

    if (user?.location) {
      setLocation(user?.location);
    } else {
      setLocation("US");
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(user?.phoneCountry);
    } else {
      setCountryCallingCode(" +1");
    }
  }, [props?.viewKYC?.user]);

  const onChange = (e) => {
    if (e.target.name === "fname") {
      setFname(e.target.value);
    } else if (e.target.name === "lname") {
      setLname(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      setPhone(value);
    } else if (e.target.name === "city") {
      setCity(e.target.value);
    } else if (e.target.name === "res_address") {
      setResAddress(e.target.value);
    } else if (e.target.name === "dob") {
      setDob(e.target.value);
    } else if (e.target.name === "location") {
      setLocation(e.target.value);
    }
  };

  const submitHandler = async () => {
      let formSubmit = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        dob: dob ? dob.toLocaleDateString("en-GB") : null,
        location: location,
        city: city,
        res_address: res_address,
        phoneCountry: countryCallingCode,
      };
      let updateUser = await jwtAxios
        .put(
          `/users/updateAccountSettings/${props?.viewKYC?.user?.wallet_address}`,
          formSubmit
        )
        .catch((error) => {
          if(typeof error == "string")
          {
            dispatch(notificationFail(error));
          }
          if (error?.response?.data?.message === "") {
            dispatch(notificationFail("Invalid "));
          }
          if(error?.response?.data?.message)
          {
            dispatch(notificationFail(error?.response?.data?.message));
          }
        });
      if (updateUser) {
        props.onHide();
        props.getusers();
        dispatch(notificationSuccess("User details updated successfully !"));
      }
  };

  const phoneCountry = () => {
    const result = listData.find((item) => item?.code === countryCallingCode);
    return `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`;
  };

  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{display:"flex"}} onClick={onClick} >
    <Form.Control className="example-custom-input" ref={ref} value={value} placeholder="DD MMMM YYYY" />
    <CalenderIcon width={30} height={30} />
    </div>
  ));

  const countryName = () => {
    return `https://flagcdn.com/h40/${location?.toLowerCase()}.png`;
  };
  return (
    <Modal
      {...props}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="transaction-header">
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="edit-user">
        <Form>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John"
                  name="fname"
                  value={fname}
                  defaultValue={fname}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Doe"
                  name="lname"
                  value={lname}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="your@email.com"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Phone number</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      placeholder={countryCallingCode}
                      name="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      maxlength="10"
                    />

                    {countryCallingCode ? (
                      <img
                        src={phoneCountry()}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}
                    <p className="text-white mb-0">
                      {
                        listData.find(
                          (item) => item?.code === countryCallingCode
                        )?.cca3
                      }
                    </p>
                    <div className="country-select">
                      <Form.Select
                        size="sm"
                        onChange={(e) => {
                          setCountryCallingCode(e.target.value);
                          dispatch(definePhoneCode(e.target.value));
                        }}
                        value={countryCallingCode}
                      >
                        {listData.map((data, key) => (
                          <option value={`${data?.code}`} key={key}>
                            {data?.country} ({data?.code})
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Date of Birth</Form.Label>
                <DatePicker
                  selected={dob}
                  onChange={(e) => setDob(e)}
                  className="form-control"
                  wrapperClassName="w-100"
                  placeholderText="DD MMMM YYYY"
                  dateFormat="dd MMMM yyyy"
                  name="dob"
                  customInput={<DatepickerCustomInput />}
                  maxDate={new Date()}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Location</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      placeholder={"Newyork"}
                      name="city"
                      value={city}
                      onChange={(e) => {
                        onChange(e);
                      }}
                    />

                    {location ? (
                      <img
                        src={countryName()}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}
                    <p className="text-white mb-0">
                      {listData.find((item) => item?.iso === location)?.cca3}
                    </p>
                    <div className="country-select">
                      <Form.Select
                        size="sm"
                        onChange={(e) => {
                          setLocation(e.target.value);
                          dispatch(defineCountry(e.target.value));
                        }}
                        value={location}
                      >
                        {listData.map((data, key) => (
                          <option value={`${data.iso}`} key={key}>
                            {data.country}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Form.Group className="form-group">
                <Form.Label>Residential address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your address"
                  name="res_address"
                  value={res_address}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserDetails;
