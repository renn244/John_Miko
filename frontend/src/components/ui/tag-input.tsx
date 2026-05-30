import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { Input } from "./input";

type InputTagsProps = ComponentProps<"input"> & {
    value: string[];
    onChange: (value: string[]) => void;
    fieldDescription?: string;
    listHeading?: string;
    invalid? : boolean;
} & ComponentProps<"input">;

const InputTags = ({ className, value, onChange, fieldDescription, listHeading = 'Added Items', ref, invalid = false, ...props }: InputTagsProps) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    useEffect(() => {
        if (pendingDataPoint.includes(",")) {
            const newDataPoints = new Set([
                ...value,
                ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
            ]);
            onChange(Array.from(newDataPoints));
            setPendingDataPoint("");
        }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
        if (pendingDataPoint) {
            const newDataPoints = new Set([...value, pendingDataPoint]);
            onChange(Array.from(newDataPoints));
            setPendingDataPoint("");
        }
    };

    const handleRemoveDataPoint = (index: number) => {
        const newDataPoints = value.filter((_, i) => i !== index);
        onChange(newDataPoints);
    };

    return (
        <>
            <div className="flex gap-3 mb-4">
                <Input 
                value={pendingDataPoint}
                onChange={(e) => setPendingDataPoint(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        addPendingDataPoint()
                    }
                }}
                aria-invalid={invalid}
                ref={ref}
                {...props}
                />
                
                <Button type="button" onClick={addPendingDataPoint}>
                    Add
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            {value.length > 0 ? (
                <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                        {listHeading} ({value.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {value.map((amenity, index) => (
                            <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2"
                            >
                                {amenity}
                                <button
                                type="button"
                                onClick={() => handleRemoveDataPoint(index)}
                                className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        {fieldDescription ? fieldDescription : "No data added yet. Start by typing a value and clicking 'Add'."}
                    </p>
                </div>
            )}
        </>
    );
};

InputTags.displayName = "InputTags";

export { InputTags };
