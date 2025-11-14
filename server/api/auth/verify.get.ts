import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Get token from Authorization header or query
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '') ||
                getQuery(event).token

  if (!token) {
    return false
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)
    return decoded.admin === true
  } catch (error) {
    return false
  }
})