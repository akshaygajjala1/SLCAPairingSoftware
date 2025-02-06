import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"
import fetch from "node-fetch";
import { get } from "http";

async function getFIDEPlayer(id) {
    const response = await fetch(`https://fide-api.vercel.app/player_info/?fide_id=${id}&history=true`);
    return response.ok ? response.json() : null;
}

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    if (req.method == "POST") {
        //Handle both adding students and adding schools
        console.log(req.body.setting);
        const rounds = await prisma.round.findMany({
            where: {
                sectionId: req.body.sectionId,
            }   
        })

        if (req.body.setting === "students") {
            try {
                const { players, sectionId } = req.body;
                if (!Array.isArray(players)) {
                    return res.status(400).json({ message: "Invalid data format." });
                }

                await prisma.player.createMany({
                    data: players.map(player => ({
                        id: `${player.name}-${sectionId}`,
                        name: player.name,
                        sectionId,
                        schoolId: player.schoolId,
                        record: 0,
                    })),
                    skipDuplicates: true, // Prevent duplicate errors
                });
                return res.status(200).json({ message: "Players added successfully." });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error." });
            }
        }

        if (req.body.setting == "student") {
            if (req.body.fideID) {
                const fidePlayer = await getFIDEPlayer(fideID);
                if (fidePlayer) {
                    playerData = {
                        name: fidePlayer.name,
                        rating: fidePlayer.history[0].classical_rating
                    };
                }
            }
            console.log("Trello")
            //handle student addition
            await prisma.player.create({
                data: {
                    id: req.body.student + req.body.sectionId,
                    schoolId: req.body.schoolId,
                    sectionId: req.body.sectionId,
                    name: playerData.name || req.body.student,
                    record: 5 * rounds.length,
                    rating: playerData.rating || null
                }
            });
            if (playerData) {
                res.status(200).json({ player: playerData });
            }
        } else {
            console.log("shit man");
            //handle school addition
            await prisma.school.create({
                data: {
                    id: req.body.school + req.body.sectionId,
                    name: req.body.school,
                    sectionId: req.body.sectionId,
                }
            });
        }
        //res.status(200).json({message: "Hello"});
    }

    if (req.method == 'DELETE') {
        if (req.body.setting == 'player') {
            const deletePlayer = await prisma.player.delete({
                where: {
                    id: req.body.id,
                },
            });
            console.log(deletePlayer);
            res.status(200).json({ message: "Hello" });
        } else {
            const schools = await prisma.school.findMany();
            console.log('schools', schools);
            const school = await prisma.school.findUnique({
                where: {
                    id: req.body.id,
                },
            });
            console.log('School', school);
            res.status(200).json({ message: 'Hello' });
        }
    } else {
        //Build the list of schools and players by first getting all schools involved with section then getting each student involved with school
        const schools = await prisma.school.findMany({
            where: {
                sectionId: req.query.sectionId,
            }
        });

        const temp = [];

        for (const element of schools) {
            const players = await prisma.player.findMany({
                where: {
                    schoolId: element.id,
                },
            });
            await temp.push([element, players]);
        }
        res.status(200).json({ roster: temp });
    }
}