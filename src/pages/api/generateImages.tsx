import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { body } = req;
    try {
        const response = await axios.post(
            process.env.CREATE_IMAGE_ENDPOINT!,
            body,
            {
                headers: { authorization: `Bearer ${process.env.OPENAI_KEY}` },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}
