import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Link } from 'react-router-dom'

const MenuBar = () => {
  const navigate = useNavigate()

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-md text-gray-800 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center">
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/app"
              className="relative hover:text-black transition duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/task-list"
              className="relative hover:text-black transition duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              My Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/weekly-progress"
              className="relative hover:text-black transition duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              Weekly Progress
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="relative hover:text-black transition duration-200 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem('authToken')
                navigate('/signin')
              }}
              className="relative hover:text-black transition duration-200 
             after:content-[''] after:absolute after:left-0 
             after:bottom-[-6px] after:w-full after:h-[2px] 
             after:bg-black after:scale-x-0 hover:after:scale-x-100 
             after:transition-transform after:duration-200"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default MenuBar
