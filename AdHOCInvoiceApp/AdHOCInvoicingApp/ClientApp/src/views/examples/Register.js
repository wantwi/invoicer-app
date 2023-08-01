/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap'

const Register = () => {
  return (
    <div style={styles.container}>
      <Col lg='6' md='8'>
        <Card className='bg-secondary shadow border-0'>
          <CardHeader className='bg-transparent pb-5'>
            <div className='text-muted text-center mt-2 mb-4'>
              <small>Sign up with</small>
            </div>
            <div className='text-center'>
              <Button
                className='btn-neutral btn-icon'
                color='default'
                href='#pablo'
                onClick={(e) => e.preventDefault()}
              >
                <span className='btn-inner--icon'>
                  <img
                    alt='...'
                    src={
                      require('../../assets/img/icons/common/google.svg')
                        .default
                    }
                  />
                </span>
                <span className='btn-inner--text'>Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className='px-lg-5 py-lg-5'>
            <div className='text-center text-muted mb-4'>
              <small>Or sign up with credentials</small>
            </div>
            <Form role='form'>
              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-circle-08' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Gana Card/TIN'
                    type='email'
                    autoComplete='new-email'
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-hat-3' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder='Name' type='text' />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Repeat Password'
                    type='password'
                    autoComplete='new-password'
                  />
                </InputGroup>
              </FormGroup>
              <div className='text-muted font-italic'>
                <small>
                  password strength:{' '}
                  <span className='text-success font-weight-700'>strong</span>
                </small>
              </div>
              <Row className='my-4'>
                <Col xs='12'>
                  <div className='custom-control custom-control-alternative custom-checkbox'>
                    <input
                      className='custom-control-input'
                      id='customCheckRegister'
                      type='checkbox'
                    />
                    <label
                      className='custom-control-label'
                      htmlFor='customCheckRegister'
                    >
                      <span className='text-muted'>
                        I agree with the{' '}
                        <a href='#pablo' onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className='text-center'>
                <Button className='mt-4' color='primary' type='button'>
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  )
}

export default Register
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'rgb(37, 39, 60)',
  },
}
