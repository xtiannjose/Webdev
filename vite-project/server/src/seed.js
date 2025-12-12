import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productsPath = path.join(__dirname, 'data', 'products.json')
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

async function main() {
  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: { name: prod.name, price: prod.price, image: prod.image, tag: prod.tag },
      create: { id: prod.id, name: prod.name, price: prod.price, image: prod.image, tag: prod.tag },
    })
  }
  console.log('Seeded products:', products.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
