import { EyeIcon, EyeOffIcon, LucideLoader } from 'lucide-react'
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
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)

  const handleRegister = async (): Promise<void> => {
    if (password !== confirmPassword) return
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
        type="text"
      />
      <div className="relative">
        <input
          className="w-full border border-gray-500 rounded-md px-2 py-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type={isPasswordVisible ? 'text' : 'password'}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="relative">
        <input
          className="w-full border border-gray-500 rounded-md px-2 py-1"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          type={isConfirmPasswordVisible ? 'text' : 'password'}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
        >
          {isConfirmPasswordVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
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
