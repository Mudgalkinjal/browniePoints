const UserInfo = ({ name, email }: { name: string; email: string }) => (
  <header className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800 text-center">
      Welcome, {name}!
    </h1>
    <p className="text-center text-gray-600">
      Your email: <strong>{email}</strong>
    </p>
  </header>
)
export default UserInfo
