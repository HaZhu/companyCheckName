import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const addLeadingZero = (value,s) => {
    return value < 10 ? `0${value}` + `${s}` : value + `${s}`;
  };
  return (
    <View style="color:#43b149;font-size:12px ">
      剩于{timeLeft.days <= 0 ? '' : timeLeft.days <= 0 + '天'}{addLeadingZero(timeLeft.hours,'小时')}
      {addLeadingZero(timeLeft.minutes,'分')}{addLeadingZero(timeLeft.seconds,'秒')}
    </View>
  );
};

export default CountdownTimer;
