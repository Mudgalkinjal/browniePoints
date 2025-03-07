import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'

type SigninData = {
  email: string
  password: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const Signinpage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>({
    resolver: yupResolver(validationSchema),
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignUp = () => {
    navigate('/signup')
  }

  const onSubmit = async (data: SigninData) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', responseData.token) // Store the token
        console.log('Signed in successfully!')
        setSuccess('User signed in successfully')
        navigate('/app')
      } else {
        setError(responseData.message || 'Incorrect password') // Show server error
      }
    } catch (error) {
      console.error('Sign-in failed:', error)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-black-400 mb-6">
          Sign In
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {success && (
          <div className="text-green-500 text-center mb-4">{success}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:ring focus:ring-[#D4E4DB]`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:ring focus:ring-[#D4E4DB]`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4E4DB] text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={handleSignUp}
          className="w-full mt-4 bg-gray-100 text-black-400 py-2 px-4 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  )
}

export default Signinpage
