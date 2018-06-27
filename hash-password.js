// This is a test app to hash an input argument using bcrypt
// module link for bcrypt is https://github.com/dcodeIO/bcrypt.js/blob/master/README.md
// to install bcrypt in node run:
// npm install bcryptjs

const bcrypt = require('bcryptjs');

const argv = require('yargs')
  .usage('$0 <cmd> [args]')
  .command(
    'hash [password]',
    'generate a salted hash of [password]',
    yargs => {
      yargs.positional('password', {
        type: 'string',
        default: 'password',
        describe: 'the password text to hash'
      });
    },
    argv => {
      console.log('Hash of ' + '[' + argv.password + ']');
      hashPassword2(argv.password, argv.rounds);
    }
  )
  .command(
    'check [hash] [password]',
    'compare [hash] to [password]',
    yargs => {
      yargs
        .positional('hash', {
          type: 'string',
          default: 'password',
          describe: 'the password text to hash'
        })
        .positional('password', {
          type: 'string',
          describe: 'the hash of the password to compare'
        });
    },
    argv => {
      matchPasswordHash(argv.password, argv.hash);
    }
  )
  .version()
  .help().argv;

function hashPassword(textPassword, rounds = 12) {
  console.log('rounds', rounds);
  bcrypt.genSalt(rounds, (err, salt) => {
    if (!err) {
      bcrypt.hash(textPassword, salt, (err, hash) => {
        if (!err) {
          console.log(hash);
        }
      });
    }
  });
}

//using promises?
function hashPassword2(textPassword, rounds = 10) {
  console.log('rounds', rounds);
  bcrypt
    .genSalt(rounds)
    .then(salt => {
      bcrypt
        .hash(textPassword, salt)
        .then(hash => {
          console.log(hash);
        })
        .catch(err => console.error('Unable to hash', err));
    })
    .catch(err => console.error('Unable to gen salt for bcrypt', err));
}

function matchPasswordHash(textPassword, hash) {
  bcrypt
    .compare(textPassword, hash)
    .then(res => console.log(res))
    .catch(err => console.error(err));
}
