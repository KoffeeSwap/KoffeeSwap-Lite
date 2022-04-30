var fs = require('fs');
var dir = './build';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}