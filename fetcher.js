
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getPage = () => {
  let data = process.argv.slice(2);
  let url = data[0];
  let pathfile = data[1];
  if (fs.existsSync(pathfile)) {
    rl.question(`${pathfile} already exists, Do you want to continue? Press y for yes: `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        getFile(url, pathfile);
      } else {
        process.exit();
      }
    });
  } else {
    getFile(url, pathfile);
  }
};


const getFile = (url, pathfile) => {
  request(`${url}`, (error, response, body) => {
    if (error) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
    }
    fs.writeFile(`${pathfile}`, body, (error) => {
      fs.access(`${pathfile}`, (error) => {
        if (error) {
          console.log("Error:",error);
        }
      });
      if (error) {
        console.log("Error Found", error);
      } else {
        console.log(`Downloaded and saved ${body.length} byte to ${pathfile}`);
        rl.close();
      }
    });
  });
};

getPage();