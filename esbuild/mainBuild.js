import { fork } from 'child_process'
import { findFiles } from './filterBaseDirectories.js'

// Directorios base donde buscar entry points
const baseDirectories = ['src']

// Encuentra todos los archivos .js dentro de src
const entryPoints = findFiles(baseDirectories, '.js')

// Cantidad de workers (ajustable)
const numWorkers = Math.min(2, entryPoints.length)

// Modo de build: offline | main
const mode = process.argv[2] || 'offline'

// Divide un array en chunks
const chunkArray = (array, size) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size)
  )

const entryChunks = chunkArray(
  entryPoints,
  Math.ceil(entryPoints.length / numWorkers)
)

console.log(`🚀 Starting build with ${numWorkers} workers...`)

let completedWorkers = 0

entryChunks.forEach((chunk, index) => {
  const worker = fork(
    new URL('./workerBuild.js', import.meta.url),
    [],
    {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    }
  )

  worker.send({ entryPoints: chunk, mode })

  worker.on('message', msg => {
    console.log(`\n🎯 Worker ${msg.workerId} finished:`)
    console.log(JSON.stringify(msg, null, 2))

    if (msg.status === 'success') {
      console.log(`✅ Worker ${msg.workerId} processed ${msg.files.length} files:`)
      msg.files.forEach(file => console.log(`   - ${file}`))
    } else {
      console.error(`❌ Worker ${msg.workerId} failed: ${msg.error}`)
    }

    if (++completedWorkers === entryChunks.length) {
      console.log('\n✅ Build completed!\n')
      process.exit(0)
    }
  })

  worker.on('error', err => {
    console.error(`❌ Worker ${index + 1} error:`, err)
    process.exit(1)
  })

  worker.on('exit', code => {
    if (code !== 0) {
      console.error(`⚠️ Worker ${index + 1} exited with code ${code}`)
    }
  })
})
