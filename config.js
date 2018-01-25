{
	title: '',
	text: '',
	type: ['success', 'warning', 'error'],
	position: ['top-right', 'bottom-right', 'top-left', 'bottom-left'],
	autoClose: false,
	showRemoveButton: false,
	duration: 2
}

// duration has to be in ms

autoClose   showRemoveButton
false		false	: not possible
false		true	: will be closed by user; no timer required
true		false	: timer value is must; default to 2s
true		true	: timer value is must; default to 2s; can be closed by user too. In that case; remove setTimeout.

1. Make sure there is exactly one parameter
2. The duration must be in positive integer format only.