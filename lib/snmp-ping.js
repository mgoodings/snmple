const snmp = require('snmp-native')

const snmpPing = (host, community) => new Promise((resolve, reject) => {
  const session = new snmp.Session({
    host,
    port: 161,
    community,
    timeouts: [500, 1000, 2000, 5000]
  })

  session.get({
    oid: [1, 3, 6, 1, 2, 1, 1, 1, 0]
  }, (err, vars) => {
    session.close()

    if (err) {
      if (err.message === 'Timeout' || err.syscall === 'send') {
        resolve(null)
      } else {
        reject(err)
      }
    } else {
      resolve([
        host,
        community,
        vars[0].value
      ])
    }
  })
})

module.exports = snmpPing
