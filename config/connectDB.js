const mongoose = require('mongoose');
const DATABASE = process.env.DATABASE

mongoose.connect(DATABASE, {
}).then(()=>{
    console.log('Connection Successfull');
}).catch((err)=>{
    console.log('No connection');
});
