// scripts/test-smtp.js
const dns = require('dns');
const net = require('net');

const host = 'smtp.gmail.com';
const port = 587;
console.log('Resolviendo DNS...');
dns.lookup(host, { all: true }, (err, addrs) => {
  if (err) return console.error('DNS error:', err.message);
  console.log('Direcciones:', addrs.map(a=>a.address));
  // probar IPv4
  const socket = net.createConnection({ host, port, family: 4 }, () => {
    console.log(`Conectado a ${host}:${port} (IPv4)`);
    socket.end();
  });
  socket.on('error', e => console.error('Error conexión IPv4:', e.code || e.message));
  socket.setTimeout(10000, () => {
    console.error('Timeout conexión IPv4');
    socket.destroy();
  });
});