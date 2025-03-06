import React from 'react'

const Header = () => {
  return (
    <header className="relative w-full bg-white shadow-md mb-10">
      {/* Background Image */}
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('/headerimg.png')`,
          backgroundSize: `102%`,
        }}
      ></div>

      {/* Logo */}
      <div
        className="rounded-full absolute left-14 bg-white shadow-md transform -translate-y-1/2"
        style={{ top: '12rem', left: '12rem' }}
      >
        <img
          src="/logo.png"
          alt="Brownie Points Logo"
          className="rounded-full w-24 h-24"
        />
      </div>
    </header>
  )
}

export default Header
