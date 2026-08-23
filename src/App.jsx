import { useEffect, useState } from "react";

function App() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newSkill, setNewSkill] = useState("");
    const [editId, setEditId] = useState(null);
    const [editSkill, setEditSkill] = useState("");

    // =========================
    // GET - READ DATA
    // =========================
    useEffect(() => {
        fetch("http://localhost:3000/api/skills")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data skills");
                }

                return response.json();
            })
            .then((data) => {
                setSkills(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Tidak bisa terhubung ke backend");
                setLoading(false);
            });
    }, []);

    // =========================
    // POST - ADD SKILL
    // =========================
    const addSkill = () => {
        if (!newSkill.trim()) {
            setError("Nama skill wajib diisi");
            return;
        }

        fetch("http://localhost:3000/api/skills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newSkill
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal menambahkan skill");
                }

                return response.json();
            })
            .then((data) => {
                setSkills([
                    ...skills,
                    {
                        id: data.id,
                        name: data.name
                    }
                ]);

                setNewSkill("");
                setError("");
            })
            .catch((error) => {
                console.error(error);
                setError("Gagal menambahkan skill");
            });
    };

    // =========================
    // DELETE - DELETE SKILL
    // =========================
    const deleteSkill = (id) => {
        fetch(`http://localhost:3000/api/skills/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal menghapus skill");
                }

                return response.json();
            })
            .then(() => {
                setSkills(
                    skills.filter((skill) => skill.id !== id)
                );

                setError("");
            })
            .catch((error) => {
                console.error(error);
                setError("Gagal menghapus skill");
            });
    };

    // =========================
    // PUT - UPDATE SKILL
    // =========================
    const updateSkill = () => {
        if (!editSkill.trim()) {
            setError("Nama skill wajib diisi");
            return;
        }

        fetch(`http://localhost:3000/api/skills/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: editSkill
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengubah skill");
                }

                return response.json();
            })
            .then(() => {
                setSkills(
                    skills.map((skill) =>
                        skill.id === editId
                            ? {
                                  ...skill,
                                  name: editSkill
                              }
                            : skill
                    )
                );

                setEditId(null);
                setEditSkill("");
                setError("");
            })
            .catch((error) => {
                console.error(error);
                setError("Gagal mengubah skill");
            });
    };

    // =========================
    // CANCEL EDIT
    // =========================
    const cancelEdit = () => {
        setEditId(null);
        setEditSkill("");
        setError("");
    };

    return (
        <div>
            <h1>My Skills</h1>

            {/* =========================
                ADD SKILL
            ========================= */}
            <div>
                <input
                    type="text"
                    placeholder="Masukkan skill"
                    value={newSkill}
                    onChange={(event) =>
                        setNewSkill(event.target.value)
                    }
                />

                <button onClick={addSkill}>
                    Add Skill
                </button>
            </div>

            {/* =========================
                EDIT SKILL
            ========================= */}
            {editId !== null && (
                <div>
                    <input
                        type="text"
                        value={editSkill}
                        onChange={(event) =>
                            setEditSkill(event.target.value)
                        }
                    />

                    <button onClick={updateSkill}>
                        Update
                    </button>

                    <button onClick={cancelEdit}>
                        Cancel
                    </button>
                </div>
            )}

            {/* =========================
                LOADING
            ========================= */}
            {loading && <p>Loading...</p>}

            {/* =========================
                ERROR
            ========================= */}
            {error && <p>{error}</p>}

            {/* =========================
                SKILL LIST
            ========================= */}
            <ul>
                {skills.map((skill) => (
                    <li key={skill.id}>
                        {skill.name}

                        {" "}

                        <button
                            onClick={() => {
                                setEditId(skill.id);
                                setEditSkill(skill.name);
                                setError("");
                            }}
                        >
                            Edit
                        </button>

                        {" "}

                        <button
                            onClick={() =>
                                deleteSkill(skill.id)
                            }
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;