import Logo from '@/assets/app/logo/logo.svg';
import { Button } from '@/components/ui/Button';
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView';
import { Pressable, Text, View } from 'react-native';

import GetPaid from '@/assets/app/Onboarding/Get-Paid.svg';
import KnowledgeLibrary from '@/assets/app/Onboarding/Knowledge-Library.svg';
import Managing from '@/assets/app/Onboarding/Managing.svg';

import { useEffect, useState } from 'react';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft
} from 'react-native-reanimated';

const informations = [
    {
        ilustration: <Managing />,
        title: 'Note Down Expenses',
        description: 'Daily note your expenses to help manage money'
    },
    {
        ilustration: <KnowledgeLibrary />,
        title: 'Simple Money Management',
        description: 'Get your notifications or alert when you do the over expenses'
    },
    {
        ilustration: <GetPaid />,
        title: 'Easy to Track and Analyze',
        description: "Tracking your expense help make sure you don't overspend" 
    }
]

const Onboarding = () => {
    const [illustrationIndex, setIllustrationIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIllustrationIndex((prevIndex) => (prevIndex + 1) % informations.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [])

    return (
        <CustomSafeAreaView className='px-6'>
            <View className='flex-1 gap-6 items-center pt-15 pb-5'>

                <View className='flex-row justify-center items-center gap-2'>
                    <Logo height={32} width={32}  />
                    <Text className='font-sans-bold font-bold text-xl'>John Miko's</Text>
                </View>

                <View className='w-full pb-6 gap-6 items-center'>
                    <View className='h-110 w-full gap-10 items-center'>

                        <Animated.View
                        key={illustrationIndex}
                        entering={FadeIn.duration(750)}
                        exiting={FadeOut.duration(500)}
                        >
                            {informations[illustrationIndex].ilustration}
                        </Animated.View>

                        <Animated.View 
                        key={`text-${illustrationIndex}`}
                        entering={SlideInRight.duration(400)}
                        exiting={SlideOutLeft.duration(200)}
                        className='gap-3 items-center'
                        >
                            <Text className='text-[18px] font-sans-semibold leading-5'>
                                {informations[illustrationIndex].title}
                            </Text>
                            <Text className='text-center text-xl font-sans text-neutral-grey-1 leading-6 tracking-wider'>
                                {informations[illustrationIndex].description}
                            </Text>
                        </Animated.View>

                    </View>
                    <View className='flex-row gap-2 items-center'>
                        
                        {informations.map((info, idx) => (
                            <Pressable
                            key={idx}
                            onPress={() => setIllustrationIndex(idx)}
                            className={`h-1.25 w-4.5 rounded-2xl ${idx === illustrationIndex ? 'bg-primary' : 'bg-neutral-soft-grey-2'}`}
                            />
                        ))}
                        
                    </View>
                </View>

                <Button 
                style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                className='w-full'>
                    <Text className="font-sans-semibold text-white text-lg">
                        LET'S GO
                    </Text>
                </Button>

            </View>
        </CustomSafeAreaView>
    )
}

export default Onboarding