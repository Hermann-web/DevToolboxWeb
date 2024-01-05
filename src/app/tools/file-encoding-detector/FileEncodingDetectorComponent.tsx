"use client";

import React, {useEffect, useRef, useState} from "react";
import Selector from "@/app/components/common/Selector";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import {User} from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import {saveHistory} from "@/utils/clientUtils";
import {ToolType} from "@prisma/client";
import {Button} from "@/app/components/common/Button";

enum Option {
    detect = "encode",
    decode = "decode",
}

const options = [
    {
        label: "Detect",
        value: Option.detect,
    },
];

export default function FileEncodingDetectorComponent({
    user,
    isProUser,
}: {
    user: User | null;
    isProUser: boolean;
}) {
    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [encoding, setEncoding] = useState<string>("");
    const [confidence, setConfidence] = useState<number>(0);
    const [currentOption, setCurrentOption] = useState<Option>(options[0].value);
    
    // Assuming you have a useDebounce hook that works similarly to useDebounce<string>
  const debouncedEncoding = useDebounce<string>(encoding, 1000);
  const debouncedConfidence = useDebounce<number>(confidence, 1000);

    useEffect(() => {
        if (debouncedEncoding || debouncedConfidence) {
            void saveHistory({
                user,
                isProUser,
                toolType: ToolType.FileEncodingDetector,
                onError: () => {
                },
                metadata: {
                    file,
                },
            });
        }
    }, [debouncedEncoding, debouncedConfidence]);

    const detectFileEncoding = (file: File | null, callback: (encoding: string, confidence: number) => void) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/encoding/detect-encoding', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json() as Promise<{ encoding: string; confidence: number }>;
        })
        .then(data => {
            const { encoding, confidence } = data;
            callback(encoding, confidence);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

            

    useEffect(() => {
        try {
            setEncoding("...");
            setConfidence(0);
            detectFileEncoding(file, (encoding:string, confidence:number) => {
                setEncoding(encoding);
                setConfidence(confidence);
            });
        } catch (e) {
            setEncoding(
                `Invalid input — could not detect string`
            );
            setConfidence(0);
        }
    }, [currentOption, input, file, isProUser, user]);

    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0])
            setFile(event.target.files[0]);
    }

    // Example usage
    return (
        <div className="w-full h-full flex gap-4">
            <div className="w-full h-full">
                <div className="flex items-center mb-4 gap-4">
                    <p className="font-bold text-xl"> Input: </p>
                    <button
                        type="button"
                        className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={() => {
                            setFile(null);
                            setEncoding("");
                        }}
                    >
                        Clear
                    </button>
                    <Selector
                        values={options}
                        handleClick={(entry) => {
                            setCurrentOption(entry.value);
                        }}
                    />
                </div>
                <div
                        className="px-8 py-2 w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6 flex-col flex items-center justify-center"
                        style={{height: "calc(100% - 44px)"}}
                    >
                        <FilePicker file={file} handleFileInput={handleFileInput}/>
                    </div>
                
            </div>
                <ReadOnlyTextArea value={encoding && `encoding: ${encoding}\nconfidence: ${confidence}`}/>
            </div>
    );
}

function FilePicker({file, handleFileInput}: {
    file: File | null,
    handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
}) {
    let fileInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    return <>
        {file && <FitFile src={URL.createObjectURL(file)} base64Enabled={false} alt="Input File"/>}
        <input type="file" name="Select File" onChange={handleFileInput}
               ref={fileInputRef}
               hidden/>
        <Button onClick={() => {
            fileInputRef.current?.click();
        }}>Choose File</Button>
    </>;
}

function FitFile({src, base64Enabled, alt}: { src: string, base64Enabled: Boolean, alt: string }) {
    if (base64Enabled) {
        try {
            if (src.trim() == "") return <></>;
            atob(isValidBase64Format(src) ? src.split(",")[1] : src);
            if (!isValidBase64Format(src)) return <p style={{maxWidth: "30vw", wordWrap: 'break-word'}}>Unable to decode<br/>Input
                must begin with
                data:file/[a-zA-Z+]*;base64,<br/><br/>
                For example
                data:file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC
            </p>

            return <img src={src}
                        style={{width: '100%', maxHeight: '85%', objectFit: 'contain', margin: '10px'}}
                        alt={alt}/>
        } catch (e: any) {
            let msg = e.message.split(": ");
            return <p>{msg.length > 1 ? msg[1] : msg[0]}</p>
        }
    }

    return <img src={src}
                style={{width: '100%', maxHeight: '85%', objectFit: 'contain', margin: '10px'}}
                alt={alt}/>
}

const isValidBase64Format = (base64String: string): boolean => {
    const regex = /^data:file\/[a-zA-Z+]*;base64,/;
    return regex.test(base64String);
};
