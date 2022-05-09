import { useRef } from 'react';

//---------------------------------------------------------------------------------------------------//
/**
 * sets the focus of the cursor to newly created input field.
 * @returns
 */
export const useFocus = () => {
	const htmlElRef = useRef(null);
	const setFocus = () => {
		htmlElRef.current && htmlElRef.current.focus();
	};

	return [htmlElRef, setFocus];
};
