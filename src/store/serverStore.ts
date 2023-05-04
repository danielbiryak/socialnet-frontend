import { create } from 'zustand'

interface ServerState {
  server_ip: string
  server_port: number | undefined
  changeIp: (ip: string) => void
  changePort: (port: number | undefined) => void
  fullAddress: () => string
}

const useServerStore = create<ServerState>(
  (set, get) => ({
    server_ip: '192.168.0.104',
    server_port: 3000,
    changeIp: (ip: string) => set({ server_ip: ip }),
    changePort: (port?: number) =>
      set({ server_port: port }),
    fullAddress: () => {
      if (get().server_port)
        return `http://${get().server_ip}:${
          get().server_port
        }`
      return `https://${get().server_ip}`
    }
  })
)

export { useServerStore }
