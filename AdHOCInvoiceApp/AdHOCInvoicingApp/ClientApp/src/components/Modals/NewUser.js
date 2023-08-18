import React, { useEffect } from 'react'

import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Modal,
} from 'reactstrap'
import { FaCircle } from 'react-icons/fa'
import "cleave.js/dist/addons/cleave-phone.gh";
import Cleave from "cleave.js/react";

function NewUser({
  setshowAddUser,
  formik,
  isEditMode,
  userStatus,
  setUserStatus,
  setIsEditMode,
  handleAddUser,
  handleUpdateUser,
  handleInviteLinkResend,
    setPhone, loading, formattedPhone
}) {
  useEffect(() => {


    return () => {
      setIsEditMode(false)
        formik?.resetForm()
        setPhone("")
        setUserStatus(true)
    }
  }, [])
  return (
    <>
      <Modal
        className='modal-dialog-centered modal-lg'
        isOpen={true}
        toggle={() => console.log('toggled')}
      >
        <div className='modal-header'>
          <h1 className='modal-title' id='exampleModalLabel'>
            {!isEditMode ? 'New User ' : 'Update User'}
          </h1>
          <button
            aria-label='Close'
            className='close'
            data-dismiss='modal'
            type='button'
            onClick={() => {
              formik.resetForm()
              setUserStatus(true)
              setIsEditMode(false)
              setshowAddUser(false)
            }}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className='modal-body' style={{ display: 'flex' }}>
          <Card className=' shadow' style={{ width: '100%', height: '500px' }}>
            <CardBody>
              <div
                style={{
                  zIndex: 100000,
                  display: 'flex',
                  flexDirection: 'roq',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                }}
              ></div>

              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>First Name</label>{' '}
                      <code style={{ color: 'darkred' }}>
                        {formik.errors.fname}
                      </code>
                      <Input
                        className='form-control'
                        placeholder='First name'
                        id='fname'
                        name='fname'
                        type='text'
                        disabled={isEditMode}
                        value={formik.values.fname}
                        onChange={formik.handleChange}
                      />
                    </FormGroup>{' '}
                  </Col>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>Last Name</label>{' '}
                      <code style={{ color: 'darkred' }}>
                        {formik.errors.lname}
                      </code>
                      <Input
                        className='form-control'
                        placeholder='Last name'
                        id='lname'
                        name='lname'
                        type='text'
                        disabled={isEditMode}
                        value={formik.values.lname}
                        onChange={formik.handleChange}
                      />
                    </FormGroup>{' '}
                  </Col>
                </Row>
                <Row>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>Email</label>{' '}
                      <code style={{ color: 'darkred' }}>
                        {formik.errors.email}
                      </code>
                      <Input
                        className='form-control'
                        placeholder='Email'
                        id='email'
                        name='email'
                        type='email'
                        disabled={isEditMode}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                    </FormGroup>{' '}
                  </Col>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>Cell Phone</label>{' '}
                      <Cleave
                        className='form-control cellPhone'
                        //  placeholder='Cell Phone'
                        type='tel'
                        id='cellPhone'
                        name='cellPhone'
                                              value={formattedPhone}
                        onChange={(e) => {
                          setPhone(e.target.rawValue)
                          formik.handleChange(e)
                        }
                        }
                        options={{ phone: true, phoneRegionCode: "GH" }}
                      />
                    </FormGroup>{' '}
                  </Col>
                </Row>
                <Row>
                  <Col lg='12'>
                    <FormGroup>
                      <label className='form-control-label'>Username</label>{' '}
                      <code style={{ color: 'darkred' }}>
                        {formik.errors.username}
                      </code>
                      <Input
                        className='form-control'
                        placeholder='Username'
                        type='tel'
                        id='username'
                        name='username'
                        disabled={isEditMode}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                    </FormGroup>{' '}
                  </Col>
                </Row>
                <Row>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>User Type</label>
                      <Input
                        disabled={isEditMode}
                        type='select'
                        className='form-control'
                        id='userType'
                        name='userType'
                        value={formik.values.userType}
                        onChange={formik.handleChange}
                      >
                        <option>Select User Type</option>
                        <option value={1}>Admin</option>
                        <option value={0}>Default</option>
                      </Input>
                    </FormGroup>{' '}
                  </Col>
                  <Col lg='6'>
                    <FormGroup>
                      <label className='form-control-label'>Status</label>
                      <Button
                        className='form-control'
                        color='secondary'
                        id='userStatus'
                        name='userStatus'
                        onClick={() => setUserStatus(!userStatus)}
                      >
                        <FaCircle
                          color={userStatus ? 'green' : 'red'}
                          style={{ marginRight: 20 }}
                        />
                        {userStatus ? 'Active' : 'Inactive'}
                      </Button>
                    </FormGroup>{' '}
                  </Col>
                </Row>
              </Form>
            </CardBody>

            <div className='modal-footer'>
              {' '}
              {!isEditMode ? (
                <Button
                  color='success'
                  type='button'
                  onClick={() => handleAddUser()}
                >
                  {loading ? "Submitting" : "Submit"}
                </Button>
              ) : (
                <>
                  {/* <Button
                    color='secondary'
                    type='button'
                    onClick={() => console.log("Invite link wanted")}
                  >
                    Resend Invite Link
                  </Button> */}
                  <Button
                    color='secondary'
                    type='button'
                    onClick={() => handleInviteLinkResend()}
                  >
                    Resend Invite Link
                  </Button>
                  <Button
                    color='success'
                    type='button'
                    onClick={() => handleUpdateUser()}
                  >
                    Update
                  </Button>
                </>

              )}
            </div>
          </Card>
        </div>
      </Modal>
    </>
  )
}

export default NewUser
