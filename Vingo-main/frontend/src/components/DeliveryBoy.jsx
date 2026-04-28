import React, { useEffect, useState, useContext } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { SocketContext } from "../SocketContext" // ✅ NEW

function DeliveryBoy() {

  const { userData } = useSelector(state => state.user)

  const socketRef = useContext(SocketContext) // ✅ NEW
  const socket = socketRef?.current            // ✅ NEW

  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // 🔥 LOCATION TRACKING + SOCKET EMIT
  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return

    let watchId

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          setDeliveryBoyLocation({ lat: latitude, lon: longitude })

          socket.emit('updateLocation', {
            latitude,
            longitude,
            userId: userData._id
          })
        },
        (error) => {
          console.log(error)
        },
        {
          enableHighAccuracy: true
        }
      )
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }

  }, [socket, userData])

  // 🔥 REALTIME NEW ASSIGNMENT LISTENER
  useEffect(() => {
    if (!socket) return

    const handler = (data) => {
      setAvailableAssignments(prev => ([...prev, data]))
    }

    socket.on('newAssignment', handler)

    return () => {
      socket.off('newAssignment', handler)
    }

  }, [socket])

  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  const sendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })

      setShowOtpBox(true)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp
      }, { withCredentials: true })

      setMessage(result.data.message)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
      setTodayDeliveries(result.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (userData) {
      getAssignments()
      getCurrentOrder()
      handleTodayDeliveries()
    }
  }, [userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>

        {/* HEADER */}
        <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] text-center border border-orange-100'>
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData.fullName}</h1>
          <p>
            Lat: {deliveryBoyLocation?.lat} | Lon: {deliveryBoyLocation?.lon}
          </p>
        </div>

        {/* AVAILABLE ORDERS */}
        {!currentOrder && (
          <div className='bg-white p-5 w-[90%] border rounded-lg'>
            {availableAssignments?.length > 0 ? (
              availableAssignments.map((a, i) => (
                <div key={i} className='flex justify-between'>
                  <p>{a.shopName}</p>
                  <button onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
                </div>
              ))
            ) : (
              <p>No Orderzz</p>
            )}
          </div>
        )}

        {/* CURRENT ORDER */}
        {currentOrder && (
          <div className='bg-white p-5 w-[90%] border rounded-lg'>
            <p>{currentOrder.shopOrder.shop.name}</p>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation,
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude
                }
              }}
            />

            {!showOtpBox ? (
              <button onClick={sendOtp}>Mark Delivered</button>
            ) : (
              <>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button onClick={verifyOtp}>Verify OTP</button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default DeliveryBoy