import Logo from '@/assets/app/logo/logo.svg';
import { Button } from '@/components/ui/Button';
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView';
import { hasSeenIntro, setSeenIntro } from '@/lib/introStorage';
import { Image } from 'expo-image';
import { PanResponder, Pressable, Text, View } from 'react-native';

import { router } from 'expo-router';
import { useMemo, useEffect, useState } from 'react';
import Animated, {
    Easing,
    FadeOut,
    SlideInLeft,
    SlideInRight
} from 'react-native-reanimated';

const slides = [
    {
        illustration: require('@/assets/app/Onboarding/resort-staff.png'),
        title: 'Resort Ops Ready',
        description: 'Handle check-ins, room status, and guest requests in one flow.'
    },
    {
        illustration: require('@/assets/app/Onboarding/kitchen-staff.png'),
        title: 'Kitchen Team Sync',
        description: 'See pre-orders, menu tasks, and service updates faster.'
    },
    {
        illustration: require('@/assets/app/Onboarding/maintenance-staff.png'),
        title: 'Maintenance On The Move',
        description: 'Log issues, track fixes, and keep facilities running smoothly.'
    }
]

const Onboarding = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isChecking, setIsChecking] = useState(true);
    const swipeThreshold = 50;

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

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_event, gestureState) =>
                    Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderRelease: (_event, gestureState) => {
                    if (gestureState.dx <= -swipeThreshold) {
                        handleNext();
                        return;
                    }

                    if (gestureState.dx >= swipeThreshold) {
                        handlePrev();
                    }
                },
            }),
        []
    );

    const enteringAnimation = direction === 'next'
        ? SlideInRight.duration(220).easing(Easing.out(Easing.cubic))
        : SlideInLeft.duration(220).easing(Easing.out(Easing.cubic));
    const exitingAnimation = FadeOut.duration(90).easing(Easing.out(Easing.cubic));

    if (isChecking) {
        return <CustomSafeAreaView className='flex-1 bg-neutral-soft-grey-3' />;
    }

    return (
        <CustomSafeAreaView className='bg-neutral-soft-grey-3 px-6'>
            <View className='flex-1 items-center pb-5 pt-8'>

                <View className='flex-row justify-center items-center gap-2'>
                    <Logo height={20} width={20}  />
                    <Text className='font-sans-bold text-xl text-primary'>John Miko&apos;s</Text>
                </View>

                <View className='w-full flex-1 items-center justify-between pt-8'>
                    <View
                        className='w-full flex-1 items-center justify-center'
                        {...panResponder.panHandlers}
                    >
                        <Animated.View
                        key={`slide-${slideIndex}`}
                        entering={enteringAnimation}
                        exiting={exitingAnimation}
                        className='w-full items-center gap-8'
                        >
                            <View className='h-72 w-full items-center justify-center'>
                                <Image
                                    source={slides[slideIndex].illustration}
                                    contentFit='contain'
                                    style={{ height: '100%', width: '100%' }}
                                />
                            </View>

                            <View className='items-center gap-2 px-3'>
                                <Text className='text-center font-sans-bold text-2xl leading-7 text-neutral-dark-1'>
                                    {slides[slideIndex].title}
                                </Text>
                                <Text className='max-w-72 text-center font-sans text-base leading-5 text-neutral-grey-1'>
                                    {slides[slideIndex].description}
                                </Text>
                            </View>
                        </Animated.View>
                    </View>

                    <View className='w-full gap-5'>
                    <View className='flex-row w-full items-center justify-center'>
                        <View className="flex-row gap-2 items-center">
                            {slides.map((_slide, idx) => (
                                <Pressable
                                key={idx}
                                onPress={() => handleSelect(idx)}
                                className={`h-1.25 w-4.5 rounded-2xl ${idx === slideIndex ? 'bg-primary' : 'bg-neutral-soft-grey-2'}`}
                                />
                            ))}
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
                            LET&apos;S GO
                        </Text>
                    </Button>
                    </View>
                </View>

            </View>
        </CustomSafeAreaView>
    )
}

export default Onboarding
