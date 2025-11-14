import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body

    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: '请提供密码'
      })
    }

    const config = useRuntimeConfig()

    // Verify password (convert both to string to handle type conversion)
    const adminPassword = String(config.adminPassword)
    if (password !== adminPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: '密码错误'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { admin: true },
      config.jwtSecret || 'default-secret',
      { expiresIn: '24h' }
    )

    return {
      success: true,
      token
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '登录失败'
    })
  }
})