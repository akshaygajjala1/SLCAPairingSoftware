import formidable from "formidable";
import fs from "fs"; // fs stands for file system
import prisma from "../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed." });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "./player_uploads";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing the file." });
    }

    const { sectionId } = fields;
    const file = files.file;

    const filePath = file.filepath;
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

    const players = parseCSV(fileContent);

    for (const player of players) {
      const { name, schoolName } = player;

      let school = await prisma.school.findFirst({
        where: { name: schoolName, sectionId },
      });

      if (!school) {
        school = await prisma.school.create({
          data: { name: schoolName, sectionId },
        });
      }

      await prisma.player.create({
        data: {
          name,
          sectionId,
          schoolId: school.id,
          colorHistory: [],
        },
      });
    }

    // delete the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Bulk player upload successful." });
  });
};

const parseCSV = (content) => {
  const lines = content.split("\n");
  const headers = lines[0].split(",");
  const players = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const data = line.split(",");
    const player = {};

    headers.forEach((header, index) => {
      player[header.trim()] = data[index].trim();
    });

    players.push(player);
  }

  return players;
};

export default handler;
