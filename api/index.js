export default async function handler(req, res) {

  const { action, id } = req.query

  if (!id) return res.send("Falta ID")

  const GITHUB_TOKEN = "TU_TOKEN"
  const REPO = "WrPages/gp_ids"
  const FILE_PATH = "ids.txt"

  const headers = {
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "Accept": "application/vnd.github+json"
  }

  const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, { headers })
  const file = await fileRes.json()

  const content = Buffer.from(file.content, "base64").toString("utf-8")

  let ids = content.split("\n").filter(x => x.trim() !== "")

  if (action === "online") {
    if (!ids.includes(id)) ids.push(id)
  }

  if (action === "offline") {
    ids = ids.filter(x => x !== id)
  }

  const newContent = ids.join("\n")

  await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "update ids",
      content: Buffer.from(newContent).toString("base64"),
      sha: file.sha
    })
  })

  res.send("OK")
}
