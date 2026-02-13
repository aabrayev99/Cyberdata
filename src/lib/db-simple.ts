import { Pool } from 'pg'

const globalForPool = globalThis as unknown as {
  pool: Pool | undefined
}

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  })

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool

// Helper functions for database operations
export async function createUser(userData: {
  id: string
  name: string
  email: string
  password: string
  role?: string
}) {
  const { rows } = await pool.query(
    `INSERT INTO users (id, name, email, password, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, role, "createdAt"`,
    [userData.id, userData.name, userData.email, userData.password, userData.role || 'STUDENT']
  )
  return rows[0]
}

export async function findUserByEmail(email: string) {
  const { rows } = await pool.query(
    'SELECT id, name, email, password, role, image FROM users WHERE email = $1',
    [email]
  )
  return rows[0]
}

export async function findUserById(id: string) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, image FROM users WHERE id = $1',
    [id]
  )
  return rows[0]
}

// Generate a simple ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Course functions
export async function createCourse(courseData: {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  image?: string
  level: string
  price?: number
  duration?: number
  instructorId: string
}) {
  const { rows } = await pool.query(
    `INSERT INTO courses (id, title, slug, description, "shortDescription", image, level, price, duration, "instructorId") 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
     RETURNING *`,
    [
      courseData.id,
      courseData.title,
      courseData.slug,
      courseData.description,
      courseData.shortDescription,
      courseData.image,
      courseData.level,
      courseData.price || 0,
      courseData.duration,
      courseData.instructorId
    ]
  )
  return rows[0]
}

export async function getAllCourses(published = true) {
  const query = published 
    ? 'SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c."instructorId" = u.id WHERE c.published = true ORDER BY c."createdAt" DESC'
    : 'SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c."instructorId" = u.id ORDER BY c."createdAt" DESC'
  
  const { rows } = await pool.query(query)
  return rows
}

export async function getCourseBySlug(slug: string) {
  const { rows } = await pool.query(
    'SELECT c.*, u.name as instructor_name, u.bio as instructor_bio FROM courses c JOIN users u ON c."instructorId" = u.id WHERE c.slug = $1',
    [slug]
  )
  return rows[0]
}

export async function getCoursesByInstructor(instructorId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM courses WHERE "instructorId" = $1 ORDER BY "createdAt" DESC',
    [instructorId]
  )
  return rows
}

export async function updateCourse(courseId: string, updates: any) {
  const setClause = Object.keys(updates)
    .map((key, index) => `"${key}" = $${index + 2}`)
    .join(', ')
    
  const values = [courseId, ...Object.values(updates)]
  
  const { rows } = await pool.query(
    `UPDATE courses SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  )
  return rows[0]
}

// Lesson functions
export async function createLesson(lessonData: {
  id: string
  title: string
  slug: string
  content: string
  description?: string
  videoUrl?: string
  duration?: number
  order: number
  courseId: string
}) {
  const { rows } = await pool.query(
    `INSERT INTO lessons (id, title, slug, content, description, "videoUrl", duration, "order", "courseId") 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING *`,
    [
      lessonData.id,
      lessonData.title,
      lessonData.slug,
      lessonData.content,
      lessonData.description,
      lessonData.videoUrl,
      lessonData.duration,
      lessonData.order,
      lessonData.courseId
    ]
  )
  return rows[0]
}

export async function getLessonsByCourse(courseId: string, published = true) {
  const query = published
    ? 'SELECT * FROM lessons WHERE "courseId" = $1 AND published = true ORDER BY "order" ASC'
    : 'SELECT * FROM lessons WHERE "courseId" = $1 ORDER BY "order" ASC'
    
  const { rows } = await pool.query(query, [courseId])
  return rows
}

export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const { rows } = await pool.query(
    `SELECT l.*, c.title as course_title, c.slug as course_slug 
     FROM lessons l 
     JOIN courses c ON l."courseId" = c.id 
     WHERE c.slug = $1 AND l.slug = $2`,
    [courseSlug, lessonSlug]
  )
  return rows[0]
}

// Enrollment functions
export async function enrollUserInCourse(userId: string, courseId: string) {
  const { rows } = await pool.query(
    'INSERT INTO enrollments (id, "userId", "courseId") VALUES ($1, $2, $3) RETURNING *',
    [generateId(), userId, courseId]
  )
  return rows[0]
}

export async function getUserEnrollments(userId: string) {
  const { rows } = await pool.query(
    `SELECT e.*, c.title, c.slug, c.image, c.description 
     FROM enrollments e 
     JOIN courses c ON e."courseId" = c.id 
     WHERE e."userId" = $1 
     ORDER BY e."enrolledAt" DESC`,
    [userId]
  )
  return rows
}

export async function checkEnrollment(userId: string, courseId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM enrollments WHERE "userId" = $1 AND "courseId" = $2',
    [userId, courseId]
  )
  return rows[0]
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
