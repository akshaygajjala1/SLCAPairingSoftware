import { PlusCircleIcon, CheckIcon, XMarkIcon, PlusSmallIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

export default function Roster({ section }) {
  const [roster, setRoster] = useState();
  const [newSchoolName, setNewSchoolName] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  
  async function fetchRoster() {
    await fetch(`/api/roster?sectionId=${section}`)
      .then((res) => res.json())
      .then((data) => {
        setRoster(data.roster)
      })
  }

  useEffect(() => {
    fetchRoster();
  }, [section])

  async function deleteSchool(name) {
    await fetch('/api/roster', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: name, setting: 'school' })
    })
    fetchRoster()
  }
  async function deletePlayer(name, studentID) {
    await fetch('/api/roster', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentName: name, id: studentID, setting: 'player' })
    })
    fetchRoster()
  }

  async function addNewSchool() {
    await fetch("/api/roster", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ school: newSchoolName, sectionId: section, setting: "school", colorHistory: [] }),
    })
    fetchRoster();
    setAddNew(false);
    setNewSchoolName("");
  }

  async function addNewStudent(name, school, fideID="", setNewStudentName=(_) => {}) {
    //send request with name, school, section, tourney
    await fetch("/api/roster", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        schoolId: school.id, 
        student: name,
        sectionId: section,
        setting: "student", 
        fideID
      }),
    })
    const data = await response.json();
    if (data.player) {
      setNewStudentName(data.player.name);
    }
    fetchRoster();
  }

  function SchoolDisplay({ schoolPack, addNewStudent, deletePlayer }) {
    const [addNew, setAddNew] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [fideID, setFideId] = useState("");
    return (
      <div>
        <h1 style={{ display: "inline" }} className='font-bold '>{schoolPack[0].name}</h1>
        <TrashIcon style={{ width: 18, height: 18, display: "inline", marginLeft: 10, marginBottom: 5, color: "red" }} onClick={() => {
          console.log('schoool', schoolPack[0].name)
          deleteSchool(schoolPack[0].id)
        }} />
        {schoolPack[1].map((student, index) =>
          <div style={{ display: 'flex', marginLeft: 20 }}>
            <p key={index}>{student.name}</p>
            <TrashIcon style={{ width: 16, height: 16, display: "inline", marginLeft: 5, marginTop: 4, color: "red" }} onClick={() => {
              deletePlayer(student.name, student.id)
            }} />
          </div>
        )}
        {addNew ?
          <div className='flex items-center space-x-2'>
            <input value={newStudentName}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.code == "Enter") {
                  addNewStudent(newStudentName, schoolPack[0]);
                  setNewStudentName("");
                  setAddNew(false)
                }
              }} onChange={(e) => { setNewStudentName(e.target.value) }} className="my-1 appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Player Name" />
            
            <input 
              value={fideID}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.code == "Enter") {
                  addNewStudent("", schoolPack[0], fideID, setNewStudentName);
                  setAddNew(false)
                }
              }} onChange={(e) => { setNewStudentName(e.target.value) }} className="my-1 appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="FIDE ID"
            />
            <button onClick={() => {
              addNewStudent(newStudentName, schoolPack[0]);
              setNewStudentName("");
              setAddNew(false)
            }} className="bg-green-500 hover:bg-green-700 text-white font-bold  rounded">
              <CheckIcon className='h-6 w-6' />
            </button>

            <button onClick={() => setAddNew(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold  rounded">
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>
          :
          <div style={{ marginLeft: 10, }} onKeyDown={(e) => {
            if (e.code == "Enter" && !addNew) {
              setAddNew(true)
            }
          }} onClick={() => setAddNew(true)} className='flex items-center hover:bg-purple-200 underline rounded max-w-fit cursor-pointer transition ease-in-out'>
            <PlusSmallIcon className='h-5 w-5' style={{ marginLeft: 5 }} />
            <p className='' style={{ marginRight: 10 }}>New Player</p>
          </div>
        }
        <hr className="my-2" />
      </div>
    )
  }

  const handleFileChange = (event) => {
    setBulkFile(event.target.files[0]);
  };

  // Handle player bulk upload
  const handleBulkUpload = async () => {
    if (!bulkFile) return;

    const formData = new FormData();
    formData.append("file", bulkFile);
    formData.append("sectionId", section);

    await fetch("/api/bulk-upload", {
      method: "POST",
      body: formData,
    });

    fetchRoster();
    setBulkFile(null);
  };
  
  function displayRoster() {
    return (
      <div>
        {roster && roster.map((schoolPack, index) => (
          <SchoolDisplay
            schoolPack={schoolPack}
            key={index}
            addNewStudent={addNewStudent}
            deletePlayer={deletePlayer}
          />
        ))}
        {roster && roster.length === 0 && (
          <div>
            <p className="font-bold mb-2">No Schools Currently Added.</p>
          </div>
        )}
        {addNew ? (
          <div>
            <div className='flex items-center space-x-2'>
              <input
                autoFocus={true}
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="New School Name"

                onKeyDown={(e) => {
                  if (e.code == "Enter") {
                    addNewSchool();
                  }
                }}
              />
              <button
                onClick={() => addNewSchool()}
                className="bg-green-500 hover:bg-green-700 text-white font-bold rounded"
              >
                <CheckIcon className='h-8 w-8' />
              </button>
              <button
                onClick={() => setAddNew(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold rounded"
              >
                <XMarkIcon className='h-8 w-8' />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setAddNew(true)}
            className='rounded flex items-center space-x-2 font-bold py-2 px-2 pmb-4 bg-purple-500 hover:bg-purple-700 text-white transition ease-in-out cursor-pointer max-w-fit'
          >
            <PlusCircleIcon className='h-6 w-6 ' />
            <h1>Add New School</h1>
          </div>
        )}
        <div className="bulk-upload">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleBulkUpload}
            disabled={!bulkFile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Roster
          </button>
        </div>
      </div>
    )
  }
  
  return displayRoster()
}
