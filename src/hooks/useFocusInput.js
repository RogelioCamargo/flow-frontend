import { useCallback, useRef } from "react";

function useFocusInput() {
	const inputRef = useRef();

	const focusOnInput = useCallback(() => {
		inputRef.current.focus();
	}, []);

	return [inputRef, focusOnInput];
}

export default useFocusInput;
