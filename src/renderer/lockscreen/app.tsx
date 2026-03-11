export default function App(): React.JSX.Element {
  const openTimer = (): void => window.electron.ipcRenderer.send('open-timer')

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="text-5xl text-purple-500">ZA Pisonet</div>
      <a target="_blank" rel="noreferrer" onClick={openTimer}>
        Open Timer
      </a>
    </div>
  )
}
