export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.status(400).json({ error: "URL inválida." });
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            res.status(response.status).json({ error: "Erro ao acessar o stream." });
            return;
        }

        const contentType = response.headers.get("Content-Type");
        res.setHeader("Content-Type", contentType);
        response.body.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar o proxy." });
    }
}