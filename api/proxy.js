export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.status(400).json({ error: "URL inválida." });
        return;
    }

    try {
        // Requisição para a URL fornecida
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Cabeçalhos adicionais podem ser necessários
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!response.ok) {
            res.status(response.status).json({ error: "Erro ao acessar o stream." });
            return;
        }

        // Verifica se a resposta contém um redirecionamento
        const location = response.headers.get('Location');
        if (location) {
            // Se houver redirecionamento, faz a requisição para o novo link com o token
            const redirectResponse = await fetch(location);
            redirectResponse.body.pipe(res);
        } else {
            // Se não houver redirecionamento, envia a resposta original
            const contentType = response.headers.get("Content-Type");
            res.setHeader("Content-Type", contentType);
            response.body.pipe(res);
        }

    } catch (error) {
        res.status(500).json({ error: "Erro ao processar o proxy." });
    }
}