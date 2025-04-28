import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../prisma/client"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const record = await prisma.dialog.findUnique({
        where: { id: String(id) },
      })

      if (!record) {
        return res.status(404).json({ message: "Record not found" })
      }

      return res.status(200).json(record)
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
