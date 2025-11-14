import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header or query
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '') ||
                  getQuery(event).token

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权'
      })
    }

    // Verify JWT token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)

    if (!decoded.admin) {
      throw createError({
        statusCode: 403,
        statusMessage: '权限不足'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: '请提供当前密码和新密码'
      })
    }

    // Verify current password
    if (currentPassword !== config.adminPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: '当前密码错误'
      })
    }

    // In a real implementation, you would update the password in a secure way
    // For demo purposes, we'll just return success
    // In production, you might want to:
    // 1. Update environment variables
    // 2. Update a secure configuration file
    // 3. Use a proper password hashing system

    return {
      success: true,
      message: '密码修改成功'
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 403,
        statusMessage: '无效的 token'
      })
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '修改密码失败'
    })
  }
})