import { buttons, UserInput } from '@/components/userInput';
import useAutosizeTextArea from '@/textArea/AutoResizeTextArea';
import { imagesType } from '@/Types/Types';
import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image';
import { off } from 'process';
import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<imagesType[] | null>(null);
  const [prompt, setPrompt] = useState("")
  const [promptError, setPromptError] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [numberOfImagesError, setNumberOfImagesError] = useState(false)
  const [selectedSizeOfImage, setSelectedSizeOfImage] = useState("256x256")
  const [loading, setLoading] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, prompt);

  const handlePromptChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setPrompt(val);
  };

  const handleNumberOfImagesChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfImages(Number(event.target.value))
    if(Number(event.target.value ) > 10) {
      setNumberOfImagesError(true)
    }
  }

  const loadingWidget = () => {
    if(prompt){
      setLoading(true)
    }
  }
 
  const generateImage = async () => {
    if (!prompt) {
      setPromptError(true);
      return;
    }
    const response = await axios.post("/api/generateImages", {
      prompt,
      n: numberOfImages,
      size: selectedSizeOfImage
    });
    setGeneratedImage(response.data.data);
    setLoading(false)
  };
  
  useEffect(() => {
    const promptTimer = setTimeout(() => promptError && setPromptError(false), 3000);
    const numberTimer = setTimeout(() => numberOfImagesError && setNumberOfImagesError(false), 3000)

    return () => clearTimeout(promptTimer);
  }, [promptError, numberOfImagesError]);

  return (
    <>
      <Head>
        <title>Generate images project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className='flex flex-col w-full h-screen gap-5 justify-center items-center p-[20px]'>
        <p className='uppercase text-xl font-thin font-mono'>Image Generator</p>
        <UserInput prompt={prompt} handlePromptChange={handlePromptChange} handleNumberOfImagesChange={handleNumberOfImagesChange} textAreaRef={textAreaRef} promptError={promptError}/>
        {promptError && (
        <div className="text-red-400">Please describe the picture you want to generate.</div>
      )}
        {numberOfImagesError && (
          <p className="text-red-400">maximum amount of pictures generated can be 10</p>
        )}
        <div className='flex flex-row gap-4'>
            {buttons.map((button, index) => (
                <button key={index} onClick={() => setSelectedSizeOfImage(button)} className={`${selectedSizeOfImage === button ?  "bg-blue-200 scale-125" : ""} text-black bg-blue-200 px-4 py-1 text-center rounded-full text-sm sizeButton`}>{button}</button>
                ))}
        </div>
        <button onClick={() => {
          generateImage();
          loadingWidget()
        }} className="generateButton rounded-full px-[25px] py-[5px] bg-blue-400 font-bold uppercase text-xl">Generate</button>
        {loading && (
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)}
        <div className='flex justify-between flex-row flex-wrap gap-6'>
          {generatedImage ? generatedImage.map((image) => (
            <Image src={image.url} alt={prompt} width={300} height={300} key={image.url} className="border border-black"/>
            )) : null}
            </div>
        </div>
      </main>
    </>
  )
}
