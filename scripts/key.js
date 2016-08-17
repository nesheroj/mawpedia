console.log(process.argv[2]);
console.log(require('thirty-two').encode(process.argv[2]).toString().replace('=', ''));
