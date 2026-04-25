import axios from "axios";
import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_UPLOAD_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

type Status = "idle" | "uploading" | "done" | "error"

export function useCloudinaryUpload() {
    const [status, setStatus] = useState<Status>("idle")
    const [progress, setProgress] = useState(0)
    const [url, setUrl] = useState("")
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", UPLOAD_PRESET)

        setStatus("uploading")
        setProgress(0)
        setError(null)

        try {
            const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
                {
                    onUploadProgress: (e) => {
                        if (e.total) {
                            const pct = Math.round((e.loaded / e.total) * 100)
                            setProgress(pct)
                        }
                    },
                }
            )

            setUrl(data.secure_url)
            setStatus("done")
            return data.secure_url
        } catch (err) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.error?.message ?? "Upload failed"
                : "Unexpected error"
            setError(msg)
            setStatus("error")
            throw new Error(msg)
        }
    }

    const reset = () => {
        setStatus("idle")
        setProgress(0)
        setUrl("")
        setError(null)
    }

    return { upload, reset, status, progress, url, error }
}