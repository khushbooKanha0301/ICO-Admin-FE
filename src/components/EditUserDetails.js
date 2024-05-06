import listData from "./countryData";
import React, { forwardRef, useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../../src/store/slices/notificationSlice";
import jwtAxios from "../../src/service/jwtAxios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CalenderIcon } from "./SVGIcon";
import SelectOptionDropdown from "./SelectOptionDropdown";
import SelectLocationDropdown from "./SelectLocationDropdown";

//This component is used for edit user details
export const EditUserDetails = (props) => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");

  const [res_address, setResAddress] = useState("");
  const [location, setLocation] = useState("US");
  const [nationality, setNationality] = useState("United States");
  const [countryCallingCode, setCountryCallingCode] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [imageUrlSet, setImageUrl] = useState("https://flagcdn.com/h40/us.png");
  const [imageSearchUrlSet, setImageSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [selectedOption, setSelectedOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [searchText, setSearchText] = useState(
    `${selectedOption?.country} (${selectedOption?.code})`
  );

  const [selectedLocationOption, setSelectedLocationOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [imageUrlLocationSet, setImageLocationUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageLocationSearchUrlSet, setImageLocationSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [searchLocationText, setSearchLocationText] = useState(
    `${selectedLocationOption?.country}`
  );

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      setLocation(user?.location ? user?.location : "US");
    }

    if (user?.location) {
      setLocation(user?.location);
      const result = listData.find((item) => item?.iso === user?.location);
      setSelectedLocationOption(result);
      setImageLocationUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setImageLocationSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setSearchLocationText(result?.country);
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(user?.phoneCountry);
      const result = listData.find((item) => item?.code === user?.phoneCountry);
      setSelectedOption(result);
      setImageUrl(`https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`);
      setSearchText(`${result?.country} (${result?.code})`);
      setImageSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
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
        if (typeof error == "string") {
          dispatch(notificationFail(error));
        }
        if (error?.response?.data?.message === "") {
          dispatch(notificationFail("Invalid "));
        }
        if (error?.response?.data?.message) {
          dispatch(notificationFail(error?.response?.data?.message));
        }
      });
    if (updateUser) {
      props.onHide();
      props.getusers();
      dispatch(notificationSuccess("User details updated successfully !"));
    }
  };

  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{ display: "flex" }} onClick={onClick}>
      <Form.Control
        className="example-custom-input"
        ref={ref}
        value={value}
        placeholder="DD/MM/YYYY"
      />
      <CalenderIcon width={30} height={30} />
    </div>
  ));

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
                <div
                  className={`d-flex items-center phone-number-dropdown justify-between relative`}
                >
                  {!isMobile && (
                    <>
                      <Form.Control
                        placeholder={countryCallingCode}
                        name="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        maxLength="10"
                      />
                      {selectedOption?.code ? (
                        <img
                          src={imageUrlSet}
                          alt="Flag"
                          className="circle-data"
                        />
                      ) : (
                        "No Flag"
                      )}
                      <SelectOptionDropdown
                        imageUrlSet={imageUrlSet}
                        setImageUrl={setImageUrl}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        setCountryCallingCode={setCountryCallingCode}
                        countryCallingCode={countryCallingCode}
                        setSearchText={setSearchText}
                        searchText={searchText}
                        setImageSearchUrl={setImageSearchUrl}
                        imageSearchUrlSet={imageSearchUrlSet}
                      />
                    </>
                  )}
                  {isMobile && (
                    <>
                      <Form.Control
                        placeholder={countryCallingCode}
                        name="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        maxLength="10"
                        className="md:w-auto w-full"
                      />
                      <div className="text-center relative mobile-setting-dropdown flex items-center">
                        {selectedOption?.code ? (
                          <img
                            src={imageUrlSet}
                            alt="Flag"
                            className="circle-data"
                          />
                        ) : (
                          "No Flag"
                        )}
                        <SelectOptionDropdown
                          imageUrlSet={imageUrlSet}
                          setImageUrl={setImageUrl}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          setCountryCallingCode={setCountryCallingCode}
                          countryCallingCode={countryCallingCode}
                          setSearchText={setSearchText}
                          searchText={searchText}
                          setImageSearchUrl={setImageSearchUrl}
                          imageSearchUrlSet={imageSearchUrlSet}
                        />
                      </div>
                    </>
                  )}
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
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Location</Form.Label>
                <div className="d-flex items-center phone-number-dropdown justify-between relative">
                  {!isMobile && (
                    <>
                      <Form.Control
                        placeholder={"Newyork"}
                        name="city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          onChange(e);
                        }}
                      />

                      {location ? (
                        <img
                          src={imageUrlLocationSet}
                          alt="Flag"
                          className="circle-data"
                        />
                      ) : (
                        "No Flag"
                      )}
                      <SelectLocationDropdown
                        selectedLocationOption={selectedLocationOption}
                        setSelectedLocationOption={setSelectedLocationOption}
                        setImageLocationUrl={setImageLocationUrl}
                        imageUrlLocationSet={imageUrlLocationSet}
                        setImageLocationSearchUrl={setImageLocationSearchUrl}
                        imageLocationSearchUrlSet={imageLocationSearchUrlSet}
                        setSearchLocationText={setSearchLocationText}
                        searchLocationText={searchLocationText}
                        setCountry={setLocation}
                        country={location}
                        setNationality={setNationality}
                      />
                    </>
                  )}

                  {isMobile && (
                    <>
                      <Form.Control
                        placeholder={"Newyork"}
                        name="city"
                        type="text"
                        value={city}
                        className="md:w-auto w-full"
                        onChange={(e) => {
                          onChange(e);
                        }}
                      />

                      <div className="text-center relative mobile-setting-dropdown flex items-center">
                        {location ? (
                          <img
                            src={imageUrlLocationSet}
                            alt="Flag"
                            className="circle-data"
                          />
                        ) : (
                          "No Flag"
                        )}
                        <SelectLocationDropdown
                          selectedLocationOption={selectedLocationOption}
                          setSelectedLocationOption={setSelectedLocationOption}
                          setImageLocationUrl={setImageLocationUrl}
                          imageUrlLocationSet={imageUrlLocationSet}
                          setImageLocationSearchUrl={setImageLocationSearchUrl}
                          imageLocationSearchUrlSet={imageLocationSearchUrlSet}
                          setSearchLocationText={setSearchLocationText}
                          searchLocationText={searchLocationText}
                          setCountry={setLocation}
                          country={location}
                          setNationality={setNationality}
                        />
                      </div>
                    </>
                  )}
                </div>
                {/* <div className="d-flex align-items-center">
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

                  <div className="country-select" ref={optionsDropdownRef}>
                    
                    <div
                      className="dropdownPersonalData form-select form-select-sm"
                      onClick={toggleCountryOptions}
                    >
                     <p className="text-white mb-0">{listData.find((item) => item?.iso === location)?.cca3}</p>
                    </div>
                    {showCountryOptions && (
                      <ul className="options locationDropdown">
                        {listData.map((data, key) => (
                          <li
                            key={key}
                            onClick={() => {
                              handleSelectedCountryClick(data?.iso);
                              dispatch(defineCountry(data?.iso));
                            }}
                          >
                           {data.country}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div> */}
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
          <Button variant="primary" onClick={submitHandler} className="edit-user-btn">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserDetails;
