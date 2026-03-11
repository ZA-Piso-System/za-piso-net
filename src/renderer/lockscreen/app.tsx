export default function App(): React.JSX.Element {
  const testTimer = (): void => window.electron.ipcRenderer.send('test-timer')

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="text-5xl text-purple-500">ZA Pisonet</div>
      <a target="_blank" rel="noreferrer" onClick={testTimer}>
        Test Timer
      </a>
    </div>
  )
}
