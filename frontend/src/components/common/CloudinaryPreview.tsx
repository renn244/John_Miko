interface Props {
    images: { url: string }[]
    onRemove: (id: number) => void
}

export function CloudinaryPreview({ images,  onRemove }: Props) {
    if (images.length === 0) return null

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                    <img
                        src={image.url}
                        alt={`uploaded image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6
                            bg-black/50 hover:bg-black/70 text-white text-xs
                            font-bold rounded-full flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/30 px-1.5 py-1
                        opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">
                            {index + 1} of {images.length}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}