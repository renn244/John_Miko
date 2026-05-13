import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

type CustomSafeAreaProps = {
    className?: string;
} & ComponentProps<typeof View> 

const CustomSafeAreaView = ({
    className, ...props
}: CustomSafeAreaProps) => {
    const insets = useSafeAreaInsets();

    return <View 
    className={twMerge(
        'flex-1', 
        className, 
    )} 
    style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
    }}
    {...props} 
    />
}

export default CustomSafeAreaView