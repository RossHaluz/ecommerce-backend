const { HttpError, CtlrWrapper } = require("../helpers");

const responseInvoice = async (req, res) => {
    console.log('helloo');
    console.log(req.body);
}

module.exports = {
    responseInvoice: CtlrWrapper(responseInvoice)
}