const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) return res.status(401).json({ error: "User not logged in!" });

    try {
        const validToken = verify(accessToken, "secret");
        if (validToken) {
            req.user = validToken;
            return next();
        }
    } catch (err) {
        return res.status(403).json({ error: "Invalid Token" });
    }
};

module.exports = { validateToken };

