import { LucideLoader } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onSwitchForm: () => void
  onRegisterCallback: () => void
}

export const RegisterForm = ({ onSwitchForm, onRegisterCallback }: Props): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleRegister = async (): Promise<void> => {
    setLoading(true)
    await window.electron.ipcRenderer.invoke('register', { name, email, password })
    onRegisterCallback()
    setLoading(false)
  }

  return (
    <div className="bg-white flex flex-col gap-4 p-4 rounded-md">
      <div>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <div className="text-sm text-gray-500">
          Already have an account?{' '}
          <button className="underline underline-offset-4" onClick={onSwitchForm}>
            Login
          </button>
        </div>
      </div>
      <input
        className="border border-gray-500 rounded-md px-2 py-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        type="text"
      />
      <input
        className="border border-gray-500 rounded-md px-2 py-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <input
        className="border border-gray-500 rounded-md px-2 py-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button
        className="w-full bg-purple-600 hover:bg-purple-400 disabled:bg-purple-300 flex justify-center items-center gap-2 text-white text-sm rounded-md px-4 py-2"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading && <LucideLoader className="animate-spin size-4" />}
        Register
      </button>
    </div>
  )
}
