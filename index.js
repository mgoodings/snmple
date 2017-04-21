const argv = require('yargs')
  .alias('sn', 'subnet')
  .array('sn')
  .nargs('sn', 1)
  .describe('sn', 'Subnet to scan')
  .demandOption(['sn'])
  .alias('c', 'community')
  .array('c')
  .nargs('c', 1)
  .describe('c', 'Snmp community to scan')
  .help('h')
  .alias('h', 'help')
  .argv

const cidrRange = require('cidr-range')
const snmpPing = require('./lib/snmp-ping')

const scanPool = (pool, communities) => {
  const results = []

  pool.forEach(ip => {
    communities.forEach(community => {
      results.push(snmpPing(ip, community))
    })
  })

  return Promise.all(results)
}

argv.subnet.forEach(subnet => {
  console.log('Scanning subnet:', subnet)

  scanPool(cidrRange(subnet), argv.community)
    .then(res => res.filter(x => !!x))
    .then(res => console.log(res))
    .catch(err => console.error(err))
})
