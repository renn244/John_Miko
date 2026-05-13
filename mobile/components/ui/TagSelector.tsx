import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputSubmitEditingEvent, View } from 'react-native';

type TagSelectorProps = {
    onAddTag: (tag: string) => void;
    onSelectTag: (tag: string) => void;
    tags: string[];
    selectedTag: string;
}

const TagSelector = ({ 
    onAddTag, onSelectTag, tags, selectedTag 
}: TagSelectorProps) => {
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleAddTag = (e: TextInputSubmitEditingEvent) => {
        setIsAddingTag(false)
        onAddTag(e.nativeEvent.text);
    }
    return (
        <View className='flex-row flex-wrap gap-4'>
            <Pressable 
            disabled={isAddingTag}
            onPress={() => setIsAddingTag(true)}
            className='p-4 border border-dashed border-neutral-grey-1 rounded-2xl'
            >
                <Plus width={16} height={16} color="#6B7580" />
            </Pressable>

            {isAddingTag && (
                <View className='p-5 min-w-2 rounded-[20px] bg-primary'>
                    <TextInput 
                    autoFocus={true} 
                    onSubmitEditing={handleAddTag}
                    />
                </View>
            )}

            {tags.map((tag) => (
                <Pressable 
                className={`p-4 rounded-2xl ${selectedTag === tag ? 'bg-primary' : 'bg-white'}`}
                key={tag}
                onPress={() => onSelectTag(tag)}
                >
                    <Text className={`font-sans text-base leading-4 tracking-wider ${selectedTag === tag ? 'text-white' : 'text-black'}`}>
                        {tag}
                    </Text>
                </Pressable>
            ))}
        </View>
    )
}

export default TagSelector