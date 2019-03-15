'use strict'

const fs = require('fs')
const path = require('path')
// eslint-disable-next-line
const http2 = require('http2')
const helper = require('./helper')

const { HTTP2_HEADER_PATH } = http2.constants
const PORT = process.env.PORT || 4430
const PUBLIC_PATH = path.join(__dirname, '../public')

const publicFiles = helper.getFiles(PUBLIC_PATH)

const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, '../tls/server.crt')),
  key: fs.readFileSync(path.join(__dirname, '../tls/server.key'))
}, onRequest)

// Push file
function push(stream, path) {
  const file = publicFiles.get(path)

  if (!file) {
    console.warn(`Could not push ${path} as it does not exist.`)
    return
  }

  console.log(`Pushing ${path}...`)
  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
  })
}

// Request handler
function onRequest(req, res) {
  const reqPath = req.url === '/push' ? '/public/index.html' : req.url
  console.log(`${res.statusCode}: ${req.url} -> ${reqPath}`)
  const file = publicFiles.get(reqPath)

  // File not found
  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }

  // Push with index.html
  if (reqPath === '/public/index.html') {
    push(res.stream, '/public/video_01.m4s')
    push(res.stream, '/public/video_02.m4s')
    push(res.stream, '/public/video_03.m4s')
    push(res.stream, '/public/video_04.m4s')
    push(res.stream, '/public/video_05.m4s')
    push(res.stream, '/public/video_06.m4s')
    push(res.stream, '/public/video_07.m4s')
    push(res.stream, '/public/video_08.m4s')
    push(res.stream, '/public/video_09.m4s')
    push(res.stream, '/public/video_10.m4s')
    push(res.stream, '/public/video_11.m4s')
    push(res.stream, '/public/video_12.m4s')
    push(res.stream, '/public/video_13.m4s')
    push(res.stream, '/public/video_14.m4s')
    push(res.stream, '/public/video_15.m4s')
    push(res.stream, '/public/video_16.m4s')
    push(res.stream, '/public/video_17.m4s')
    push(res.stream, '/public/video_18.m4s')
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

server.listen(PORT, (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Server listening on ${PORT}`)
})
