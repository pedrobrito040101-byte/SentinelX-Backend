const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()

app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})

let alerts = [
  {
    ip: "192.168.0.45",
    event: "Falha no login",
    risk: "Alto",
  },
  {
    ip: "45.12.88.10",
    event: "Varredura de porta",
    risk: "Crítico",
  },
  {
    ip: "10.0.0.8",
    event: "Malware detectado",
    risk: "Médio",
  },
]

app.get("/", (req, res) => {
  res.json({
    message: "SentinelX API Online",
  })
})

app.get("/alerts", (req, res) => {
  res.json(alerts)
})

io.on("connection", (socket) => {
  console.log("Usuário conectado")

  setInterval(() => {
    const newAlert = {
      ip: `192.168.0.${Math.floor(Math.random() * 255)}`,
      event: "Tentativa suspeita",
      risk: ["Médio", "Alto", "Crítico"][
        Math.floor(Math.random() * 3)
      ],
    }

    alerts.unshift(newAlert)

    socket.emit("newAlert", newAlert)
  }, 5000)
})

const PORT = 3000

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})