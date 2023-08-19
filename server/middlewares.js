const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
}

module.exports = { errorHandlerMiddleware };
