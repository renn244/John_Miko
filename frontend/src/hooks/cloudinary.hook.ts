import axios from "axios";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import type { MediaPurpose, UploadSignatureResponse } from "@/types/media.type";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type Status = "idle" | "uploading" | "done" | "error"

export function useCloudinaryUpload() {
    const [status, setStatus] = useState<Status>("idle")
    const [progress, setProgress] = useState(0)
    const [url, setUrl] = useState("")
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File, purpose: MediaPurpose): Promise<string> => {
        setStatus("uploading")
        setProgress(0)
        setError(null)

        try {
            if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
                throw new Error("Only JPG, PNG, and WebP images are allowed.")
            }

            if (file.size > MAX_IMAGE_SIZE) {
                throw new Error("Image must be 10 MB or smaller.")
            }

            const signatureResponse = await apiClient.post<UploadSignatureResponse>(
                "/media/upload-signature",
                { purpose },
            )

            if (signatureResponse.status < 200 || signatureResponse.status >= 300) {
                const responseData = signatureResponse.data as UploadSignatureResponse & { message?: string }
                throw new Error(responseData.message || "Unable to authorize image upload.")
            }

            const signedUpload = signatureResponse.data
            const formData = new FormData()
            formData.append("file", file)
            formData.append("api_key", signedUpload.apiKey)
            formData.append("timestamp", String(signedUpload.timestamp))
            formData.append("signature", signedUpload.signature)
            formData.append("upload_preset", signedUpload.uploadPreset)
            formData.append("public_id", signedUpload.publicId)
            formData.append("type", signedUpload.deliveryType)

            const { data } = await axios.post(
                signedUpload.uploadUrl,
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

            if (data.public_id !== signedUpload.publicId) {
                throw new Error("Cloudinary returned an unexpected media identifier.")
            }

            const uploadedUrl = signedUpload.visibility === "private"
                ? signedUpload.deliveryUrl
                : data.secure_url

            if (!uploadedUrl) {
                throw new Error("Cloudinary did not return a usable image URL.")
            }

            setUrl(uploadedUrl)
            setStatus("done")
            return uploadedUrl
        } catch (err) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.error?.message ?? "Upload failed"
                : err instanceof Error
                    ? err.message
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
