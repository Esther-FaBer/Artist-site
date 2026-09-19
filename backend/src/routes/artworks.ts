import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/artworks

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      pageSize = '20',
      seriesSlug,
      status,
      isFeatured,
      search,
    } = req.query as Record<string, string>

    const pageNum     = parseInt(page, 10)
    const pageSizeNum = parseInt(pageSize, 10)
    const skip        = (pageNum - 1) * pageSizeNum


    const where = {
      ...(seriesSlug && { series: { slug: seriesSlug } }),
      ...(status     && { status: status as any }),
      ...(isFeatured === 'true' && { isFeatured: true }),
      ...(search && {
        OR: [
          { title:       { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
    }

    const [total, artworks] = await Promise.all([
      prisma.artwork.count({ where }),
      prisma.artwork.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: [
          { year: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          medium: true,  
          series: true,
        },
      }),
    ])

    res.json({
      results: artworks,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/artworks/series

router.get('/series', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const series = await prisma.series.findMany({
      orderBy: { title: 'asc' },
      include: {
        _count: {
          select: { artworks: true }
        }
      },
    })
    res.json(series)
  } catch (err) {
    next(err)
  }
})

// GET /api/artworks/media

router.get('/media', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const media = await prisma.medium.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(media)
  } catch (err) {
    next(err)
  }
})

// GET /api/artworks/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { slug: req.params.slug },
      include: {
        medium: true,
        series: true,
        exhibitions: {
          include: {
            exhibition: true
          }
        }
      },
    })

    if (!artwork) {
      res.status(404).json({ error: 'Artwork not found' })
      return
    }

    res.json(artwork)
  } catch (err) {
    next(err)
  }
})

export default router