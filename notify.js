window.notificationService = (function () {
	
	let notificationCount = 0;
	let intervalHandle = null;
	let notificationsDurationMap = {};
	let allowedTypes = ['success', 'warning', 'error'];
	let allowedPositions = ['top-right', 'bottom-right', 'top-left', 'bottom-left'];

	function removeNotification (id) {
		let elementToBeRemoved = document.querySelector(`div#notification-${ id }`);
		elementToBeRemoved.className += ' fade-out';
		setTimeout (() => {
			elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
		}, 90);
		// elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
	}

	function handleRemoveIconClick (event) {
		let notificationId = event.target.id.substr(7);
		// Check if a counter is running for this notification
		if (notificationId in notificationsDurationMap) {
			delete notificationsDurationMap[notificationId];
		}
		removeNotification(notificationId);
	}

	function updateNotificationsInDOM () {
		// Iterate through each item in notificationsDurationMap and decrement duration for each by 100 ms.
		// If any duration becomes zero; it means its TTL is over and it should be removed from DOM.
		for (key in notificationsDurationMap) {
			notificationsDurationMap[key] -= 100;
			if (notificationsDurationMap[key] === 0) {
				// Remove from DOM
				delete notificationsDurationMap[key];
				removeNotification(key);
			}
		}
	}

	function isConfigDataValid (config) {
		try {
			if (!config || (config.constructor !== Object)) {
				throw `'window.notify' function must be called with an object as a parameter.`
			} 

			if (!config.type || (allowedTypes.indexOf(config.type) === -1)) {
				throw `Error: invalid value for parameter 'type'.\nAccepted values: ${ allowedTypes.toString() }`;
			}

			if (!config.position || (allowedPositions.indexOf(config.position) === -1)) {
				throw `Error: invalid valeu for parameter 'position'.\nAccepted values: ${ allowedPositions.toString() }`;
			}

			if (config.autoClose && typeof(config.autoClose) !== 'boolean') {
				throw `Error: invalid value for parameter 'autoClose'.\nAccepted values: true/false`
			}

			if (config.showRemoveButton && typeof(config.showRemoveButton) !== 'boolean') {
				throw `Error: invalid value for parameter 'showRemoveButton'.\nAccepted values: true/false`
			}

			if (config.duration && (typeof(config.duration) !== 'number') || config.duration < 0) {
				throw `Error: invalid value for parameter 'duration'.\nAccepted values: a positive number`
			}

			if ((config.autoClose === false) && (config.showRemoveButton === false)) {
				throw `Error: Both parameters 'autoClose' and 'showRemoveButton' cannot be false simultaneously`;
			}

			return true;
		} catch (exception) {
			window.console.error(exception);
			return false;
		}
	}

	function addNotification (config) {
		try {
			let containerDiv = document.createElement('div');
			containerDiv.className = `notification-wrapper  ${ config.type } ${ config.position }`;
			containerDiv.id = `notification-${ notificationCount }`;

			// Create title row
			let titleRow = document.createElement('div');
			titleRow.className = 'row-class';
			
			let titleDiv = document.createElement('div');
			titleDiv.className = "title-panel";
			let titleEle = document.createElement('p');
			titleEle.className = 'title';
			titleEle.innerHTML = `${ config.title || '' }`;
			titleDiv.appendChild(titleEle);
			titleRow.appendChild(titleDiv);

			if (config.showRemoveButton) {
				// Add remove icon in notification popup
				let closeEleDiv = document.createElement('div');
				closeEleDiv.className = "text-panel";
				let closeEle = document.createElement('i');
				closeEle.className = 'remove-icon';
				closeEle.id = `remove-${ notificationCount }`;
				closeEle.innerHTML = '&#x2715';
				closeEle.addEventListener('click', handleRemoveIconClick);
				closeEleDiv.appendChild(closeEle);
				titleRow.appendChild(closeEleDiv);
			}

			// Create text row
			let textRow = document.createElement('div');
			textRow.className = 'row';
			
			let textEle = document.createElement('p');
			textEle.className = "col-sm-12 col-md-12 col-lg-12";
			textEle.innerHTML = `${ config.text || '' }`;
			textRow.appendChild(textEle);

			// Add titleRow and textRow to containerDiv
			containerDiv.appendChild(titleRow);
			containerDiv.appendChild(textRow);

			document.body.appendChild(containerDiv);
			

			if (config.autoClose) {
				notificationsDurationMap[notificationCount] = config.duration || 2000;
				// Check if interval is already running
				if (intervalHandle === null) {
					// No interval is running; start one
					intervalHandle = setInterval(updateNotificationsInDOM, 100);
				}
			}
		} catch(exception) {
			window.console.error(exception);
		}
	}

	function incrementNotificationCounter () {
		notificationCount++;
	}

	function notify (config) {
		try {
			if (!isConfigDataValid(config)) {
				return;
			}

			addNotification(config);
			incrementNotificationCounter();

		} catch (exception) {
			window.console.error(exception);
		}
	};

	return {notify: notify};

})();
