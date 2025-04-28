'use client'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Label } from '@/components/ui/label'

const GoalPage = () => {
  const [vnd, setVnd] = useState('')
  const [eth, setEth] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)

  // Lấy tỷ giá ETH-VND từ API
  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd')
      setExchangeRate(response.data.ethereum.vnd)
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }
  }

  useEffect(() => {
    fetchExchangeRate() 
  }, [])

  const formatVND = (value) => {
    const number = value.replace(/\D/g, '') 
    if (number === '') return ''
    return parseInt(number).toLocaleString('vi-VN')  
  }

  const handleChange = (e) => {
    const rawValue = e.target.value
    const numericValue = rawValue.replace(/\D/g, '')  

    setVnd(formatVND(rawValue))

    if (numericValue === '') {
      setEth(0)
    } else {
      const number = parseFloat(numericValue)
      setEth(number / exchangeRate) 
    }
  }

  return (
    <div className='container px-10'>
        <Label>Mục tiêu quyên góp</Label>
      <Input 
        placeholder="Nhập mục tiêu quyên góp (VNĐ)" 
        type="text"
        className="w-full text-3xl"
        value={vnd}
        onChange={handleChange}
      />
      <div className="text-2xl mt-4">
        ≈ {eth.toFixed(6)} ETH
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Tỷ giá ETH-VND: {exchangeRate ? exchangeRate.toLocaleString('vi-VN') : 'Đang tải...'}
      </div>
    </div>
  )
}

export default GoalPage