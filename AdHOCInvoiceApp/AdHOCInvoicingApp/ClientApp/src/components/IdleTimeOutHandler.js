import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { IdleTimeOutModal } from './IdleTimeOutModal'
import { logout } from 'services/AuthService'
import { renewToken } from 'services/AuthService'

const IdleTimeOutHandler = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [isLogout, setLogout] = useState(false)

  let timer = undefined
  const events = ['click', 'scroll', 'load', 'keydown']
  const eventHandler = (eventType) => {
    // console.log(eventType)
    if (!isLogout) {
      sessionStorage.setItem('lastInteractionTime', moment())
      if (timer) {
        props.onActive()
        startTimer()
      }
    }
  }

  const startTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(
      () => {
        let lastInteractionTime = sessionStorage.getItem('lastInteractionTime')
        const diff = moment.duration(moment().diff(moment(lastInteractionTime)))
        let timeOutInterval = props.timeOutInterval
          ? props.timeOutInterval
          : 6000
        if (isLogout) {
          clearTimeout(timer)
        } else {
          if (diff._milliseconds < timeOutInterval) {
            startTimer()
            props.onActive()
          } else {
            props.onIdle()
            setShowModal(true)
          }
        }
      },
      props.timeOutInterval ? props.timeOutInterval : 60000
    )
  }
  const addEvents = () => {
    events.forEach((eventName) => {
      window.addEventListener(eventName, eventHandler)
    })

    startTimer()
  }
  const removeEvents = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandler)
    })
  }

  const handleContinueSession = () => {
    startTimer()
    renewToken()
    setShowModal(false)
    setTimeout(() => {
      location.reload()
    }, 3000)
  }
  const handleLogout = () => {
    removeEvents()
    clearTimeout(timer)
    logout()
    setShowModal(false)
    setTimeout(() => {
      window.location('/')
    }, 2000)
  }

  useEffect(() => {
    addEvents()

    return () => {
      removeEvents()
    }
  }, [])

  return (
    <div>
      <IdleTimeOutModal
        showModal={showModal}
        handleContinue={handleContinueSession}
        handleLogout={handleLogout}
      />
    </div>
  )
}

export default IdleTimeOutHandler
