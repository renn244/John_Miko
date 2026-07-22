import { useCloudinaryUpload } from "@/hooks/cloudinary.hook"
import type { MediaPurpose } from "@/types/media.type"
import { useRef, useState, type ChangeEvent, type DragEvent } from "react"

interface Props {
    purpose: MediaPurpose
    onSuccess: (url: string) => void
    onError?: (err: Error) => void
    accept?: string
}

export function CloudinaryUpload({
    purpose,
    onSuccess,
    onError,
    accept = "image/*",
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const uploadInFlightRef = useRef(false)
    const [dragging, setDragging] = useState(false)
    const { upload, reset, status, progress, error } = useCloudinaryUpload()

    const handleFile = (file: File | undefined) => {
        if (!file || uploadInFlightRef.current) return
        uploadInFlightRef.current = true

        upload(file, purpose)
            .then((url) => {
                onSuccess(url)
                // reset so dropzone is ready for next file immediately
                reset()
                if (inputRef.current) inputRef.current.value = ""
            })
            .catch((err) => {
                onError?.(err)
                if (inputRef.current) inputRef.current.value = ""
            })
            .finally(() => {
                uploadInFlightRef.current = false
            })
    }

    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        handleFile(e.target.files?.[0])

    return (
        <div className="flex flex-col gap-3">

            <div
            onClick={() => status !== "uploading" && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`
                border-2 border-dashed rounded-xl p-10 text-center
                transition-colors select-none
                ${status === "uploading"
                    ? "border-primary/30 bg-primary/5 cursor-not-allowed"
                    : dragging
                    ? "border-primary/40 bg-primary/10 cursor-pointer"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"}
            `}
            >
                <p className="text-2xl mb-2">↑</p>
                <p className="text-sm font-medium text-gray-700">
                    {status === "uploading"
                        ? `Uploading... ${progress}%`
                        : "Drop image here or click to browse"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP — max 10 MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={onChange}
                />
            </div>

            {status === "uploading" && (
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {status === "error" && error && (
                <div className="flex items-center justify-between gap-3">
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                    <button
                        type="button"
                        className="shrink-0 text-sm font-medium text-primary hover:underline"
                        onClick={() => inputRef.current?.click()}
                    >
                        Try again
                    </button>
                </div>
            )}

        </div>
    )
}
