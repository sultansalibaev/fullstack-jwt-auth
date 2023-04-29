const jwt = require('jsonwebtoken')
const tokenModal = require('../models/token-modal')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userDate = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userDate;
        }
        catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userDate = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userDate;
        }
        catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModal.findOne({ user: userId })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModal.create({ user: userId, refreshToken })
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModal.deleteOne({ refreshToken })
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModal.findOne({ refreshToken })
        return tokenData;
    }
}

module.exports = new TokenService()
