const mongoose = require('mongoose');
/**
 *@function connectedDb database connect
 */
const connectedDb = async () => {
    console.log(process.env.NODE_ENV)
    if (process.env?.NODE_ENV === 'development') {
        try {
            let uri = 'mongodb://localhost:27017/bill'
            await mongoose.connect(uri);
            console.log('Database Connected Successfully')
        } catch (error) {
            console.log(error.message);
        }
    } else {
        try {
            const uri = process.env.MONGO_URL;
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`Database Connected Successfully`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit();
        }

    }
}
module.exports = connectedDb;