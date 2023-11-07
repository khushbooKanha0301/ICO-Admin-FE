import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { notificationFail } from "../store/slices/notificationSlice";
import { login } from "../store/slices/AuthenticationSlice";

const Login = () => {
  const [password, setPassword] = useState("Password");
  const [email, setEmail] = useState("admin@middn.com");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUser = () => {
    const req = { userName: email, password: password };
    if (!email) {
      dispatch(notificationFail("Please Enter Email.."));
    } else if (!password) {
      dispatch(notificationFail("Please Enter Password.."));
    } else {
      dispatch(login(req));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      loginUser();
    }
  };

  return (
    <div className="login-wrapper">
      <Card body className="cards-dark login-container">
        <Card.Title as="h4" className="text-white">
          Login Page
        </Card.Title>
        <Form>
          <Row>
            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Username"
                  autoComplete="username"
                  onKeyPress={handleKeyPress}
                />
              </Form.Group>
            </Col>
            <Col md="12">
              <Form.Group className="form-group mb-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  onKeyPress={handleKeyPress}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto">
            <Button className="login-btn" variant="primary" onClick={() => loginUser()}>
              Login
            </Button>
            </Col>
            <Col xs="auto" className="forgot-link">
              <Link to='/forgot-password'>Forgot password?</Link>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
