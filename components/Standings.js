import { TrophyIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { Parser } from "json2csv";

export default function Standings({ section }) {
    const [stands, setStands] = useState([])

    useEffect(() => {
        fetch(`/api/standings?sectionId=${section}`)
            .then((res) => res.json())
            .then((data) => {
                setStands(data.standings)
            })
    }, [section])

    const downloadCSV = () => {
        const parser = new Parser();
        const csv = parser.parse(stands.map(({ name, record, school }, index) => ({
            Place: index + 1,
            Name: name,
            School: school.name,
            Record: record / 10,
        })));
        
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "standings.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button 
                onClick={downloadCSV} 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Download Standings CSV
            </button>
            <table>
                <thead>
                    <tr>
                        <th className='bg-gray-200  border border-black border-2 border-r border-b py-1 px-4'>Rank</th>
                        <th className='bg-gray-200  border border-black border-2 border-r border-b py-1 px-4'>Name</th>
                        <th className='bg-gray-200  border border-black border-2 border-r border-b py-1 px-4'>School</th>
                        <th className='bg-gray-200  border border-black border-2 border-r border-b py-1 px-4'>Record</th>
                    </tr>
                </thead>
                <tbody>
                    {stands.map((item, index) => {
                        let color = "text-black"
                        if (index == 0) {
                            color = "text-yellow-500 animate-pulse"
                        }
                        if (index == 1) {
                            color = "text-gray-500"
                        }
                        if (index == 2) {
                            color = "text-orange-700"
                        }

                        return (
                            <tr className={"text-center font-bold p-2 " + color} key={index}>
                                <td className="border border-black p-2 text-2xl">{index + 1}</td>
                                {index != 0 ?
                                    <td className="border border-black p-2 ">{item.name}</td>
                                    :
                                    <td className="border border-black p-2 ">
                                        <div className="flex w-full items-center justify-center space-x-2">
                                            <TrophyIcon className="h-5 w-5" />
                                            <p>{item.name}</p>
                                        </div>
                                    </td>
                                }

                                <td className="border border-black p-2 ">{item.school.name}</td>
                                <td className="border border-black p-2 ">{item.record / 10}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
