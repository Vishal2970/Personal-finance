// const fs = require('fs');
// const path = require('path');

// // Create a log file path
// const logFilePath = path.join(__dirname, 'app.log');

// // Function to log messages
// function log(message) {
//     const timestamp = new Date().toISOString();
//     const logMessage = `${timestamp} - ${message}\n`;
    
//     // Append the log message to the log file
//     fs.appendFile(logFilePath, logMessage, (err) => {
//         if (err) {
//             console.error('Failed to write to log file', err);
//         }
//     });
// }

// module.exports = log;

const fs = require('fs');
const path = require('path');

// Base directory for logs
const baseLogDir = path.join(__dirname, 'logs');

// Function to log messages
function log(message) {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const dateDir = path.join(baseLogDir, dateString);

    // Create the date directory if it doesn't exist
    fs.mkdir(dateDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Failed to create directory', err);
            return;
        }

        // Create a log file path for the current date
        const logFilePath = path.join(dateDir, 'app.log');
        const timestamp = now.toISOString();
        const logMessage = `${timestamp} - ${message}\n`;

        // Append the log message to the log file
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write to log file', err);
            }
        });
    });
}

module.exports = log;