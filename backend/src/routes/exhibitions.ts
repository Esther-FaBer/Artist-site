import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/exhibitions

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, isFeatured } = req.query as Record<string, string>

    const where = {
      ...(type       && { type: type as any }),
      ...(isFeatured === 'true' && { isFeatured: true }),
    }

    const exhibitions = await prisma.exhibition.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: {
        artworks: {
          include: {
            artwork: {
              include: {
                medium: true
              }
            }
          }
        }
      }
    })

    const now = new Date()
    const withUpcoming = exhibitions.map(exhibition => ({
      ...exhibition,
      isUpcoming: exhibition.startDate > now,
      isCurrentlyOn: exhibition.startDate <= now && exhibition.endDate >= now,
    }))

    res.json(withUpcoming)
  } catch (err) {
    next(err)
  }
})

// GET /api/exhibitions/current

router.get('/current', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date()

    const exhibition = await prisma.exhibition.findFirst({
      where: {
        isFeatured: true,
      },
      orderBy: { startDate: 'desc' },
      include: {
        artworks: {
          include: {
            artwork: true
          }
        }
      }
    })

    if (!exhibition) {
      res.status(404).json({ error: 'No current exhibition found' })
      return
    }

    res.json({
      ...exhibition,
      isUpcoming: exhibition.startDate > now,
      isCurrentlyOn: exhibition.startDate <= now && exhibition.endDate >= now,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/exhibitions/:slug

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exhibition = await prisma.exhibition.findUnique({
      where: { slug: req.params.slug },
      include: {
        artworks: {
          include: {
            artwork: {
              include: {
                medium: true,
                series: true,
              }
            }
          }
        }
      }
    })

    if (!exhibition) {
      res.status(404).json({ error: 'Exhibition not found' })
      return
    }

    const now = new Date()

    res.json({
      ...exhibition,
      isUpcoming: exhibition.startDate > now,
      isCurrentlyOn: exhibition.startDate <= now && exhibition.endDate >= now,
    })
  } catch (err) {
    next(err)
  }
})

export default router