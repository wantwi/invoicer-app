import { Button, Container, Row, Col } from "reactstrap";
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "services/AuthService";

const UserHeader = ({ message, pageName = "" }) => {
  const [profile, setProfile] = React.useState("");

  // const history = useNavigate();
  React.useEffect(() => {
    //check if its logged in
    const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);
    const userOBJ = JSON.parse(user);

    //setUserData((userData) => userData + 1)

    if (!userOBJ) {
      logout();
      setTimeout(() => {
        // history("/auth/login");
      });
    } else {
      //console.log('UserData', userOBJ)
      setProfile((profile) => userOBJ.profile);
    }
  }, []);
  return (
    <>
      <div
        className="header pb-5 pt-5 pt-lg-5 d-flex align-items-center"
        style={{
          // minHeight: "200px",
          height: "200px",
          // backgroundImage:
          //   'url(' +
          //   require('../../assets/img/theme/profile-cover.jpg').default +
          //   ')',
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="12" md="10">
              <h3 className="display-5 text-white">{pageName}</h3>
              <p
                className="text-white text-small"
                style={{ fontSize: 13, marginTop: -5, paddingTop: 0 }}
              >
                {message}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
