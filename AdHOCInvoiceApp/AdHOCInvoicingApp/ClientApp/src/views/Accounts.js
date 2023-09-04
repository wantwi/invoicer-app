import UserHeader from "components/Headers/UserHeader";
import Loader from "components/Modals/Loader";
import NewUser from "components/Modals/NewUser";
import React, { useState, useEffect, useCallback } from "react";
import { GrEdit } from "react-icons/gr";
import { ErrorBoundary } from "react-error-boundary"
import Fallback from "components/Fallback"

import {
  Button,
  Table,
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { FaCircle } from "react-icons/fa";
import { debounce } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useDebounce } from "use-debounce";
import { useCustomPost } from "hooks/useCustomPost";
import { useCustomPut } from "hooks/useCustomPut";
import { useAuth } from "context/AuthContext";

const init = {
  userID: "",
  fname: "",
  lname: "",
  email: "",
  cellPhone: "",
  userType: "",
  username: "",
};

const Accounts = () => {
  const [showAddUser, setshowAddUser] = useState(false);
  const [userStatus, setUserStatus] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [value] = useDebounce(searchText, 500);
  const [phone, setPhone] = useState("");
  const { getUser, user, logout } = useAuth();

  useEffect(async () => {
    await getUser();

    return () => {};
  }, []);
  const formik = useFormik({
    initialValues: init,
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email Address").required("Required"),
      fname: Yup.string().required("Required"),
      lname: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
    }),
    onSubmit: (values) => console.log({ ...values, userStatus }),
  });

  let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  );

  const onSuccess = (data) => {
    // console.log({ data });
    //setUsers(data)
    setIsLoading(false);
  };
  const onError = (err) => {
    // console.log({ err });
    setIsLoading(false);
  };

  const { refetch, data = [] } = useCustomQuery(
    //if search value is defined the url is different
    !value ? `/api/GetUsers` : `/api/GetUsers/${value}`,
    "user",
    value,
    onSuccess,
    onError
    );

    console.log({ gha: data })

  const postSuccess = (data) => {
    toast.success("User successfully saved");
    setIsLoading(false);
    setshowAddUser(false);
    formik.resetForm();
    refetch();
  };
  const postError = (err) => {
    console.log({ err });
    toast.error(err?.response?.data || "Error saving new user");
    setIsLoading(false);
  };

  const PostResendSuccess = () => {
    setshowAddUser(false);

    toast.success("Invite link sent successfully");
  };
  const PostResendError = (err) => {
      toast.error(err?.response?.data || "Could not send invite link");
  };

  const putSuccess = (data) => {
    toast.success("User successfully updated");
    setIsLoading(false);
    setshowAddUser(false);
    setSearchText("");
    formik.resetForm();
    refetch();
  };

  const { mutate, isLoading: isLoad } = useCustomPost(
    `/api/createUser`,
    "users",
    postSuccess,
    postError
  );

  const { mutate: postResendInvite, isLoading: isLoadResend } = useCustomPost(
    `/api/SendUserEmail`,
    "users",
    PostResendSuccess,
    PostResendError
  );

  const { mutate: putmutate, isLoading } = useCustomPut(
    `/api/UpdateUserDto/${formik.values.userID}`,
    "users",
    putSuccess,
    postError
  );

  console.log({ data });

  const handleAddUser = () => {
    let formData = formik.values;
    if (!formData.fname || !formData.lname || !formData.username) {
      toast.warning("Please fill all necessary information");
      return;
    } else {
      let postData = {
        firstName: formData.fname,
        lastName: formData.lname,
        userName: formData.username,
        email: formData.email,
        phone: phone,
        role: Number(formData.userType),
      };

      mutate(postData);
      return;
    }
    let postData = {
      firstName: formData.fname,
      lastName: formData.lname,
      userName: formData.username,
      email: formData.email,
      phone: phone,
      bTin: userDetails.profile.bTin,
      role: Number(formData.userType),
      companyId: userDetails.profile.company,
      businessname: userDetails.profile.companyname,
    };

    setIsLoading(true);

    mutate(postData);
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
      setshowAddUser(true);
      setPhone(user?.phoneNumber)
    // console.log(user)
    let formikData = [user]?.map((item) => {
      return {
        userID: item.id,
        fname: item.firstName,
        lname: item.lastName,
        email: item.email,
        cellPhone: item.phoneNumber,
        userType: item.role,
        username: item.userName,
        userStatus: item.userStatus,
      };
    });

      formik.setValues(formikData[0]);

  };

  const handleInviteLinkResend = () => {
    setIsLoading(true);
    postResendInvite({ Id: formik.values.userID });
  };

  const handleUpdateUser = () => {
    setIsLoading(true);
    let formData = formik.values;

    let postData = {
      Firstname: formData.fname,
      Lastname: formData.lname,
      Email: formData.email,
      PhoneNumber: formData.cellPhone,
        PhoneNumber: formData.cellPhone,
        UserName: formData.username,
        UserStatus: userStatus,
      Role: Number(formData.userType),
    };
    putmutate(postData);
    // fetch(
    //   `${process.env.REACT_APP_CLIENT_ROOT}/Account/account/UpdateUser/${formData.userID}`,
    //   {
    //     method: 'PUT', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(postData),
    //   }
    // )
    //   .then((response) => {
    //     // console.log(response)
    //     if (response.status === 200 || response.status === 201) {
    //       toast.success('User  successfully updated')
    //       setTimeout(() => {
    //         setIsLoading(false)
    //         setshowAddUser(false)
    //       }, 2000)
    //     } else {
    //       toast.warning('Update unsuccessful')
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error('Could not update user')
    //     setTimeout(() => {
    //       setIsLoading(false)
    //     }, 2000)
    //   })
  };

  const handleSearch = debounce((e) => {
    fetch(`/api/GetUsers/${user?.jk}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, 300);

  useEffect(() => {
    if (value.length > 1) {
      refetch();
    }

    return () => {};
  }, [value]);


    const errorHandler = (error, errorInfo) => {
        console.log("Logging", error, errorInfo)
    }


  return (
    <>
      <UserHeader
        message={"This is your user management page"}
        pageName="User Account Management"
      />
          <ToastContainer />
          <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="12">
            <Card className="shadow" style={{ height: 655 }}>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <Input
                      className="form-control"
                      placeholder="Search username"
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Col>
                  <Col className="text-right" xs="6">
                    <Button
                      color="success"
                      onClick={() => setshowAddUser(!showAddUser)}
                      size="md"
                    >
                      Add New User
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody
                style={{ height: 500, maxHeight: 500, overflow: "auto" }}
                          >
                              {(isLoading || isLoad || isLoadResend) && <Loader />}
                <Table className="align-items-center  table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: "30%" }} scope="col">
                        User Name
                      </th>
                      <th style={{ width: "10%" }} scope="col">
                        Role
                      </th>
                      <th style={{ width: "30%" }} scope="col">
                        Email Address
                      </th>
                      <th style={{ width: "20%" }} scope="col">
                        Phone Number
                      </th>
                      <th style={{ width: "10%" }} scope="col">
                        Status
                      </th>
                      <th
                        style={{ textAlign: "right", width: "10%" }}
                        scope="col"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0
                      ? data?.map((user, key) => (
                          <tr key={key} onClick={() => handleEditUser(user)}>
                            <td>{user.userName}</td>

                            <td>{user.role == 1 ? "Admin" : "Default"}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                              {" "}
                              <FaCircle
                                color={user.userStatus ? "green" : "red"}
                                style={{ marginRight: 20 }}
                              />
                              {user.userStatus ? "Active" : "Inactive"}
                            </td>

                            <td
                              style={{
                                textAlign: "right",
                                width: "10%",
                                height: 20,
                                cursor: "pointer",
                              }}
                              onClick={() => handleEditUser(user)}
                            >
                              <GrEdit />
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {showAddUser && (
          <NewUser
            setshowAddUser={setshowAddUser}
            formik={formik}
            userStatus={userStatus}
            setUserStatus={setUserStatus}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleAddUser={handleAddUser}
            handleUpdateUser={handleUpdateUser}
            handleInviteLinkResend={handleInviteLinkResend}
                      setPhone={setPhone}
                      formattedPhone={phone }
            loading={isLoad}
          />
        )}
              </Container>
          </ErrorBoundary>

    </>
  );
};

export default Accounts;
