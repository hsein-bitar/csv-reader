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
        let dataOutputObject = {
            totalAverage: 0,
            totalNumberOfAllRecords: 0,
            totalSumOfAllRecords: 0,
            months: {}

        }

        // prompt user for file path
        const pathToFile = await prompt('Enter the path to the CSV file please:')
        // create file read stream
        const stream = fs.createReadStream(pathToFile)
        const data = await streamToString(stream)
        // split data into records aka rows
        const splitRows = data.split(/\r?\n/)

        // process each record, get the final needed values in one pass
        splitRows.forEach((row, index) => {
            // exclude the first row, titles
            if (index === 0) return

            const pair = row.split(",")
            const month = pair[0]?.split('/')[0]
            if (month) {
                // initialize month if not in the object already
                if (!dataOutputObject.months[month]) {
                    dataOutputObject.months[month] = {
                        recordsNumberForThisMonth: 0,
                        recordsSumForThisMonth: 0,
                        maxValueOfThisMonth: Number.MIN_VALUE,
                        minValueOfThisMonth: Number.MAX_VALUE,
                        averageOfThisMonth: 0
                    }
                }

                // account for the records in the total
                dataOutputObject.totalNumberOfAllRecords++
                dataOutputObject.totalSumOfAllRecords += Number(pair[1])

                // account for the records in the corresponding month
                dataOutputObject.months[month].recordsNumberForThisMonth++
                dataOutputObject.months[month].recordsSumForThisMonth += Number(pair[1])
                { (dataOutputObject.months[month].maxValueOfThisMonth < pair[1]) && (dataOutputObject.months[month].maxValueOfThisMonth = pair[1]) }
                { (dataOutputObject.months[month].minValueOfThisMonth > pair[1]) && (dataOutputObject.months[month].minValueOfThisMonth = pair[1]) }

            }
        })
        // calculate averages
        dataOutputObject.totalAverage = dataOutputObject.totalSumOfAllRecords / dataOutputObject.totalNumberOfAllRecords
        Object.keys(dataOutputObject.months).forEach((month) => {
            dataOutputObject.months[month].averageOfThisMonth = dataOutputObject.months[month].recordsSumForThisMonth / dataOutputObject.months[month].recordsNumberForThisMonth
        })
        console.log("\r\n\r\n")
        console.log("Here are your final results:\r\n\r\n", dataOutputObject)
        readline.close()
    } catch (e) {
        console.error("unable to prompt", e)
    }
})()

// takes a ReadStream and returns data as string
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}