import Logo from '@/assets/app/logo/logo.svg';
import { Button } from '@/components/ui/Button';
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView';
import { hasSeenIntro, setSeenIntro } from '@/lib/introStorage';
import { Pressable, Text, View } from 'react-native';

import GetPaid from '@/assets/app/Onboarding/Get-Paid.svg';
import KnowledgeLibrary from '@/assets/app/Onboarding/Knowledge-Library.svg';
import Managing from '@/assets/app/Onboarding/Managing.svg';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, {
    Easing,
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight
} from 'react-native-reanimated';

const slides = [
    {
        illustration: <Managing />,
        title: 'Resort Ops Ready',
        description: 'Handle check-ins, room status, and guest requests in one flow.'
    },
    {
        illustration: <KnowledgeLibrary />,
        title: 'Kitchen Team Sync',
        description: 'See pre-orders, menu tasks, and service updates faster.'
    },
    {
        illustration: <GetPaid />,
        title: 'Maintenance On The Move',
        description: 'Log issues, track fixes, and keep facilities running smoothly.'
    }
]

const Onboarding = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let isActive = true;

        const checkIntro = async () => {
            try {
                const seen = await hasSeenIntro();

                if (!isActive) return;

                if (seen) {
                    router.replace('/login');
                    return;
                }
            } finally {
                if (isActive) {
                    setIsChecking(false);
                }
            }
        };

        checkIntro();

        return () => {
            isActive = false;
        };
    }, [])

    useEffect(() => {
        if (isChecking) return;

        const timer = setTimeout(() => {
            setDirection('next');
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 4500);

        return () => clearTimeout(timer);
    }, [slideIndex, isChecking])

    const handleNext = () => {
        setDirection('next');
        setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setDirection('prev');
        setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const handleSelect = (index: number) => {
        if (index === slideIndex) return;
        setDirection(index > slideIndex ? 'next' : 'prev');
        setSlideIndex(index);
    };

    const enteringAnimation = direction === 'next'
        ? SlideInRight.duration(220).easing(Easing.out(Easing.cubic))
        : SlideInLeft.duration(220).easing(Easing.out(Easing.cubic));
    const exitingAnimation = direction === 'next'
        ? SlideOutLeft.duration(140).easing(Easing.in(Easing.cubic))
        : SlideOutRight.duration(140).easing(Easing.in(Easing.cubic));

    if (isChecking) {
        return <CustomSafeAreaView className='flex-1 bg-neutral-soft-grey-3' />;
    }

    return (
        <CustomSafeAreaView className='px-6'>
            <View className='flex-1 gap-6 items-center pt-15 pb-5'>

                <View className='flex-row justify-center items-center gap-2'>
                    <Logo height={32} width={32}  />
                    <Text className='font-sans-bold font-bold text-xl'>John Miko's</Text>
                </View>

                <View className='w-full pb-6 gap-6 items-center'>
                    <View className='h-110 w-full items-center justify-center'>
                        <Animated.View
                        key={`slide-${slideIndex}`}
                        entering={enteringAnimation}
                        exiting={exitingAnimation}
                        className='gap-10 items-center'
                        >
                            {slides[slideIndex].illustration}

                            <View className='gap-3 items-center'>
                                <Text className='text-[18px] font-sans-semibold leading-5'>
                                    {slides[slideIndex].title}
                                </Text>
                                <Text className='text-center text-xl font-sans text-neutral-grey-1 leading-6 tracking-wider'>
                                    {slides[slideIndex].description}
                                </Text>
                            </View>
                        </Animated.View>
                    </View>
                    <View className='flex-row w-full gap-2 items-center justify-between'>
                        <Pressable
                        onPress={handlePrev}
                        className='px-3 py-2'
                        >
                            <Text className='font-sans-semibold text-base text-neutral-grey-1'>
                                Back
                            </Text>
                        </Pressable>

                        <View className="flex-row gap-2 items-center">
                            {slides.map((_slide, idx) => (
                                <Pressable
                                key={idx}
                                onPress={() => handleSelect(idx)}
                                className={`h-1.25 w-4.5 rounded-2xl ${idx === slideIndex ? 'bg-primary' : 'bg-neutral-soft-grey-2'}`}
                                />
                            ))}
                        </View>

                        <Pressable
                        onPress={handleNext}
                        className='px-3 py-2'
                        >
                            <Text className='font-sans-semibold text-base text-primary'>
                                Next
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Button 
                onPress={async () => {
                    try {
                        await setSeenIntro();
                    } finally {
                        router.replace('/login');
                    }
                }}
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