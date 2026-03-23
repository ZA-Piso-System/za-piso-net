import { useState } from 'react'

export default function App(): React.JSX.Element {
  const [apiUrl, setApiUrl] = useState<string>('')
  const [wsUrl, setWsUrl] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [appName, setAppName] = useState<string>('')

  const handleRegister = async (): Promise<void> => {
    await window.electron.ipcRenderer.invoke('register-device', {
      apiUrl,
      wsUrl,
      token,
      appName
    })
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-xl flex flex-col gap-6">
        <h1 className="text-5xl text-purple-500">Initial Setup</h1>
        <div className="flex flex-col gap-4">
          <input
            className="border border-gray-500 rounded-md px-2 py-1"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="API Url"
            type="text"
          />
          <input
            className="border border-gray-500 rounded-md px-2 py-1"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="WS Url"
            type="text"
          />
          <input
            className="border border-gray-500 rounded-md px-2 py-1"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Registration Token"
            type="text"
          />
          <input
            className="border border-gray-500 rounded-md px-2 py-1"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="App Name"
            type="text"
          />
          <button
            className="bg-purple-400 active:bg-purple-600 text-white rounded-md px-4 py-2"
            onClick={handleRegister}
          >
            Register Device
          </button>
        </div>
      </div>
    </div>
  )
}
