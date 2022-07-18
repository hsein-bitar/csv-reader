// output
// 1. Total average BTC/USD value for entire period (December 2015 to February 2016)  
// 2. Average BTC/USD value for each month (December, January, February)  
// 3. Maximum BTC/USD value for each month (December, January, February)  
// 4. Minimum BTC/USD value for each month (December, January, February)

const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//when done reading prompt exit program 
readline.on('close', () => process.exit(1))


const prompt = (query) => new Promise((resolve) => readline.question(query, resolve));

// IIFE pattern
(async () => {
    try {
        let totalAverage, averagesPerMonth, maximumPerMonth, minimumPerMonth
        const pathToFile = await prompt('Enter the path to the CSV file please:')
        let results = []
        const final = fs.createReadStream(pathToFile)
            .on('error', (error) => {
                console.log(error)
            })
            // .pipe(csv())
            .on('data', (chunk) => results.push(Buffer.from(chunk)))
            .on('end', () => resolve(Buffer.concat(results).toString('utf8')));

        const result = await streamToString(stream)
        console.log(final)
        readline.close()
    } catch (e) {
        console.error("unable to prompt", e)
    }
})()


