import {
  Button,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip,
  Container,
  Row,
  Col,
} from 'reactstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
// core components
import UserHeader from 'components/Headers/UserHeader.js'
import { FaPaintBrush } from 'react-icons/fa'
let userDetails = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
)
const Profile = () => {
  const [copiedText, setCopiedText] = React.useState()
  const [themes, setThemes] = React.useState([
    { title: 'Pantone 2955', hexCode: '#00365f' },
    { title: 'Pantone 639', hexCode: '#00a2d7' },
    { title: 'Pantone 109', hexCode: '#ffdd00' },
    { title: 'Pantone Pro Black', hexCode: '#23181c' },
    { title: 'Pantone 199', hexCode: '#ed1848' },
    { title: 'Pantone 137', hexCode: '#f99b1c' },
    { title: 'Pantone 348', hexCode: '#009449' },
    { title: 'Pantone Metallic Gold', hexCode: '#d9b451' },
    { title: 'Pantone Metallic Silver', hexCode: '#c0bfbf' },
  ])
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className='mt--7' fluid>
        <Row>
          <Col className='order-xl-2 mb-5 mb-xl-0' xl='5'>
            <Card className='card-profile shadow'>
              <Row className='justify-content-center'>
                <Col className='order-lg-2' lg='3'>
                  <div className='card-profile-image'>
                    <a href='#pablo' onClick={(e) => e.preventDefault()}>
                      <img
                        alt='...'
                        className='rounded-circle'
                        src={require('../../assets/img/theme/user.png').default}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className='text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
                <div className='d-flex justify-content-between'></div>
              </CardHeader>
              <CardBody className='pt-0 pt-md-4'>
                <Row>
                  <div className='col'>
                    <div className='card-profile-stats d-flex justify-content-center mt-md-5'>
                      {/* <div>
                        <span className='heading'>22</span>
                        <span className='description'>Friends</span>
                      </div>
                      <div>
                        <span className='heading'>10</span>
                        <span className='description'>Photos</span>
                      </div>
                      <div>
                        <span className='heading'>89</span>
                        <span className='description'>Comments</span>
                      </div> */}
                    </div>
                  </div>
                </Row>
                <div className='text-center'>
                  <h3>{userDetails.profile.name}</h3>
                  <h4>{userDetails.profile.email[0]}</h4>
                  <h5>{userDetails.profile.phone_number}</h5>
                  <div className='h5 font-weight-300'>
                    <i className='ni location_pin mr-2' />
                    {userDetails.profile.address}
                  </div>
                  <div className='h5 mt-4'>
                    <i className='ni business_briefcase-24 mr-2' />
                    {userDetails.profile.role == 1 ? 'Admin' : 'Default'} User
                  </div>
                  <div>
                    <i className='ni education_hat mr-2' />
                    {userDetails.profile.companyname}
                  </div>
                  <div>
                    <i className='ni education_hat mr-2' />
                    {userDetails.profile.bTin}
                  </div>
                  <hr className='my-4' />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className='order-xl-1' xl='7'>
            <Card className='bg-secondary shadow'>
              <CardHeader className='bg-white border-0'>
                <Row className='align-items-center'>
                  <Col xs='8'>
                    <h3 className='mb-0'>
                      Select Color Scheme {'  '} <FaPaintBrush />
                    </h3>
                  </Col>
                  <Col className='text-right' xs='4'>
                    {/* <Button
                      color='primary'
                      href='#pablo'
                      onClick={(e) => e.preventDefault()}
                      size='sm'
                    >
                      Settings
                    </Button> */}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <div className='col'>
                    <Card className='shadow'>
                      <CardHeader className='bg-transparent'>
                        <h3 className='mb-0'>Colors</h3>
                      </CardHeader>
                      <CardBody>
                        <Row className='icon-examples'>
                          {themes?.map((theme, ind) => {
                            return (
                              <Col lg='4' md='6' key={ind}>
                                <button
                                  className='btn-icon-clipboard'
                                  data-clipboard-text='bullet-list-67'
                                  id='tooltip672244852'
                                  type='button'
                                >
                                  <div>
                                    <div
                                      style={{
                                        height: 50,
                                        width: 50,
                                        background: theme.hexCode,
                                        borderRadius: 50,
                                      }}
                                    ></div>
                                    <span>{theme.title}</span>
                                  </div>
                                </button>

                                <UncontrolledTooltip
                                  delay={0}
                                  trigger='hover focus'
                                  target='tooltip672244852'
                                >
                                  {copiedText === 'ni ni-list-67'
                                    ? 'This was selected!'
                                    : 'Click to select'}
                                </UncontrolledTooltip>
                              </Col>
                            )
                          })}{' '}
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
