import { FC } from "react"

interface UserInputProps {
    prompt: string,
    promptError: boolean,
    handlePromptChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleNumberOfImagesChange:(event: React.ChangeEvent<HTMLInputElement>) => void,
    textAreaRef:React.RefObject<HTMLTextAreaElement>
}

export const buttons = [
    "256x256",
    "512x512",
    "1024x1024",
]

export const UserInput:FC<UserInputProps> = ({prompt, handleNumberOfImagesChange,handlePromptChange, textAreaRef ,promptError}) => {
    return(
    <div className="flex flex-col w-full justify-center items-center gap-4">
        <div className="flex flex-row w-full items-center justify-center gap-[30px]">
        <textarea
        onChange={handlePromptChange}
        placeholder="describe the picture you want..."
        ref={textAreaRef}
        rows={1}
        value={prompt}
        className={`${promptError ? "border-red-500" : ""} border border-black p-[10px] resize-none w-[30%] focus-visible:outline-none bg-slate-100 rounded-xl`}
      />
        </div>
        <div className="flex flex-row gap-4 items-center">
        <p className="text-slate-600">Number of pictures:</p>
         <input type="number" min="1" max="10" onChange={handleNumberOfImagesChange} placeholder="1" className="w-[50px] focus-visible:outline-none border border-black p-[5px]"/>

        </div>
        </div>
    )
}