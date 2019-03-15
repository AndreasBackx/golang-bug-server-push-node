'use strict'

const fs = require('fs')
const path = require('path')
// eslint-disable-next-line
const http2 = require('http2')
const helper = require('./helper')

const { HTTP2_HEADER_PATH } = http2.constants
const PORT = process.env.PORT || 3000
const PUBLIC_PATH = path.join(__dirname, '../public')

const publicFiles = helper.getFiles(PUBLIC_PATH)

// console.log(publicFiles)
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, '../tls/server.crt')),
  key: fs.readFileSync(path.join(__dirname, '../tls/server.key'))
}, onRequest)

// Push file
function push(stream, path) {
  const file = publicFiles.get(path)

  if (!file) {
    return
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
  })
}

// Request handler
function onRequest(req, res) {
  console.log(`${res.statusCode}: ${req.url}`)
  const reqPath = req.url === '/' ? '/index.html' : req.url
  const file = publicFiles.get(reqPath)

  // File not found
  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }

  // Push with index.html
  if (reqPath === '/index.html') {
    push(res.stream, '/video/0/4x4/1/seg_dash_track1_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track14_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track17_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track15_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track16_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track10_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track13_13.m4s')
    push(res.stream, '/video/0/4x4/4/seg_dash_track11_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track12_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track6_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track9_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track7_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track8_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track2_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track5_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track3_13.m4s')
    push(res.stream, '/video/0/4x4/5/seg_dash_track4_13.m4s')
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
