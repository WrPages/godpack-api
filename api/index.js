export default async function handler(req, res) {
  try {
    const action = req.query.action
    const id = req.query.id

    if (!id) {
      return res.status(400).send("Falta ID")
    }

    const GITHUB_TOKEN = "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
"
    const REPO = "WrPages/gp_ids"
    const FILE_PATH = "ids.txt"

    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    }

    // 🔹 Obtener archivo
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers,
    })

    const fileText = await fileRes.text()

    if (!fileRes.ok) {
      return res.status(500).send("Error GitHub GET: " + fileText)
    }

    const file = JSON.parse(fileText)

    if (!file.content) {
      return res.status(500).send("Archivo sin contenido")
    }

    const decoded = Buffer.from(file.content, "base64").toString("utf-8")

    let ids = decoded.split("\n").filter(x => x.trim() !== "")

    // 🔹 Lógica
    if (action === "online") {
      if (!ids.includes(id)) ids.push(id)
    }

    if (action === "offline") {
      ids = ids.filter(x => x !== id)
    }

    const newContent = ids.join("\n")

    // 🔹 Subir cambios
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "update ids",
        content: Buffer.from(newContent).toString("base64"),
        sha: file.sha,
      }),
    })

    const updateText = await updateRes.text()

    if (!updateRes.ok) {
      return res.status(500).send("Error GitHub PUT: " + updateText)
    }

    return res.status(200).send("OK")

  } catch (err) {
    return res.status(500).send("ERROR: " + err.message)
  }
}
