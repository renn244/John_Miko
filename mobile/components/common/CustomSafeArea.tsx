import { ComponentProps } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomSafeAreaProps = {
    style?: StyleProp<ViewStyle>;
} & ComponentProps<typeof View>

const CustomSafeArea = ({
    style, ...props
}: CustomSafeAreaProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View 
        style={[
            styles.container,
            style,
            { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }
        ]}
        {...props}
        />
    )
}

export default CustomSafeArea;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})