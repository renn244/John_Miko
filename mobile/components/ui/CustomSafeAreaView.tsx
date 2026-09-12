import { ComponentProps, use } from 'react';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

type CustomSafeAreaProps = {
    className?: string;
} & ComponentProps<typeof View> 

const CustomSafeAreaView = ({
    className, style, ...props
}: CustomSafeAreaProps) => {
    const insets = useSafeAreaInsets();
    const tabBarHeight = use(BottomTabBarHeightContext);

    return <View 
    className={twMerge(
        'flex-1', 
        className, 
    )} 
    style={[{
        paddingTop: insets.top,
        // Tab screens already end above a bar that includes the bottom inset.
        paddingBottom: tabBarHeight ? 0 : insets.bottom,
    }, style]}
    {...props} 
    />
}

export default CustomSafeAreaView
