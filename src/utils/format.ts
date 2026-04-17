/** Mask token for display: show prefix + masked middle + suffix */
export const maskToken = (token: string): string => {
	if (!token) {
		return '<not set>'
	}

	if (token.length <= 8) {
		return `${token.slice(0, 2)}****`
	}

	return `${token.slice(0, 8)}...${token.slice(-4)}`
}
