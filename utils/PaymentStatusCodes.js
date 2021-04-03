module.exports = {
    // Payment has not been started
    PENDING : 0,

    // Payment started, awaiting result
    STARTED : 1,

    // Payment completed successfully
    SUCCESSFULL: 2,

    // Payment failed, can be started again
    FAILED: 3
}