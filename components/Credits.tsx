"use client";

import * as React from 'react';

export function Credits() {
  const [amount, setAmount] = React.useState<number>(10); // Default to 10 credits

  React.useEffect(() => {
    const storedAmount = localStorage.getItem('creditsAmount');
    if (storedAmount) {
      setAmount(parseInt(storedAmount, 10));
    } else {
      localStorage.setItem('creditsAmount', '10'); // Set default if not present
    }
  }, []);

  React.useEffect(() => {
    const handleStorageChange = () => {
      const storedAmount = localStorage.getItem('creditsAmount');
      if (storedAmount) {
        setAmount(parseInt(storedAmount, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <a>Credits: {amount}</a>;
}
