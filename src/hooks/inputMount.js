import { useEffect } from 'react';

// takes in an input field, and stores it in a useEffect
export const useMountEffect = input => useEffect(input, []);
