const validateDto = (validateFn) => {
    return (req, res, next) => {
        try {
        const validatedData = validateFn(req.body);
        req.body = validatedData;
        next();
        } catch (error) {
        res.status(400).json({ error: error.details });
        }
    };
};

module.exports = validateDto;