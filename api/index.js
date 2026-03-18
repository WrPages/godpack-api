export default async function handler(req, res) {
  try {
    const { action, id } = req.query

    const GIST_ID = "1fc02ff0921e82b3af1d3101cee44e4c"
    const TOKEN = "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
"

    // 🔹 obtener contenido actual
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`)
    const gist = await gistRes.json()

    let content = gist.files["ids.txt"].content

    let ids = content.split("\n").filter(x => x.trim() !== "")

    if (action === "online") {
      if (!ids.includes(id)) ids.push(id)
    }

    if (action === "offline") {
      ids = ids.filter(x => x !== id)
    }

    const newContent = ids.join("\n")

    // 🔹 actualizar gist
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json"
      },
      body: JSON.stringify({
        files: {
          "ids.txt": {
            content: newContent
          }
        }
      })
    })

    res.send("OK")

  } catch (err) {
    res.send("ERROR: " + err.message)
  }
}
