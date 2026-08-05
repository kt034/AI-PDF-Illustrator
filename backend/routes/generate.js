import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { InferenceClient } from '@huggingface/inference';

const router = express.Router();
const cache = new Map();

router.post('/', async (req, res) => {

const client = new InferenceClient(
    process.env.HF_TOKEN
  );


  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'No prompt provided'
      });
    }

    if (cache.has(prompt)) {
      console.log('Serving cached image');
      return res.json({
        imageUrl: cache.get(prompt)
      });
    }

    console.log('Generating image...');
    console.log(prompt);
    // DE-COMMENT WHEN YOU FIND SUITABLE INFERENCE MODEL PLAN (AVOIDING BURNING EXTRA CREDITS)
    // const image = await client.textToImage({
    //   provider: 'fal-ai',
    //   model: 'black-forest-labs/FLUX.1-dev',
    //   inputs: prompt,
    //   parameters: {
    //     num_inference_steps: 5
    //   }
    // });

    //TEST CODE (PLACEHOLDER)
  return res.json({
    imageUrl: 'https://picsum.photos/1024'
  });
  //test code ends

    const arrayBuffer = await image.arrayBuffer();

    const base64 =
      Buffer.from(arrayBuffer).toString('base64');

    const imageUrl =
      `data:image/jpeg;base64,${base64}`;

    // SAVE TO CACHE
    cache.set(prompt, imageUrl);
     res.json({
      imageUrl
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Image generation failed'
    });

  }
});

export default router;