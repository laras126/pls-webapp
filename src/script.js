const initialLanguages = require( '../_data/languages' ).initial_list;

const listenForKeyCodes = ( item, e ) => {
	if ( 32 === e.keyCode ) {
		checkForRemainingItems();
		addItemToBoard( item );
	}

	// Enter
	if ( item.classList.contains( 'is-onboard' ) ) {
		const styles = window.getComputedStyle( item );
		const itemX = styles.getPropertyValue( '--positionX' );

		let currentX = parseInt(itemX);
		
		// Move Left
		if( 37 === e.keyCode ) {
			item.style.setProperty( '--positionX',  getNewX( currentX, 'left' ) );
		}

		// Move Right
		if ( 39 === e.keyCode ) {
			item.style.setProperty( '--positionX',  getNewX( currentX, 'right' ) );
		}
	}
};

const addItemToBoard = ( item )=> {
	slider.appendChild( item );	
	item.focus();
	updateItemOnBoardState( item );
	updateItemSelectedState( item );
	Draggable.create( item, {
		type: "x",
		bounds: slider,
		dragClickables: true,
	});
};

const getNewX = ( currentX, direction ) => {
	
	let newX;
	
	if ( 'left' === direction ) {
		newX = currentX - 1;
	}
		
	if ( 'right' === direction ) {
		newX = currentX + 1;
	}
	
	if ( 0 === newX % 100  ) {
		return currentX;
	}
	
	return newX;
};

const updateItemSelectedState = ( item ) => {
	let selectedString = ' - Selected';
	let itemLabel = item.getAttribute( 'aria-label' );

	if ( document.activeElement == item ) {
		// Already selected
		// Need to update to account for on board and selected.
		if ( item.classList.contains( 'is-selected' ) ) {
			return;
		}
	
		item.classList.add( 'is-selected' );
		item.setAttribute( 'aria-label', itemLabel +  selectedString );
	} else {
		item.classList.remove( 'is-selected' );
		item.setAttribute( 'aria-label', itemLabel.replace( selectedString, '' ) );
	}

};

const updateItemOnBoardState = ( item ) => {
	const selectedString = ' - Use Left and Right arrows to move item, Tab to go to next item in list';
	let itemLabel = item.getAttribute( 'aria-label' );

	if ( document.activeElement == item ) {
		// already selected
		if ( item.classList.contains( 'is-onboard' ) ) {
			return;
		}
		
		item.classList.add( 'is-onboard' );
		item.setAttribute( 'aria-label', itemLabel +  selectedString );
	} else {
		item.classList.remove( 'is-onboard' );
		item.setAttribute( 'aria-label', itemLabel.replace( selectedString, '' ) );
	}
	
};

const checkForRemainingItems = () => {
	const remainingItems = inventory.querySelectorAll( '.js-item');

	if ( 0 < remainingItems.length ) {
		inventory.querySelectorAll( '.js-item')[0].focus();
	} else {
		// TODO: this is where we can add more langyages from JSON file.
		finalMessage.removeAttribute( 'hidden' );
	}
};

const log = c => console.log( c );

const slider = document.getElementById( 'slider' );
const inventory = document.getElementById( 'inventory' );
const finalMessage = document.getElementById( 'finalMessage' );
const form = document.getElementById( 'form' );

const createItemNode = ( name ) => {
	const button = document.createElement( 'button' );
	button.innerHTML = name;
	button.classList.add( 'js-item' );
	button.setAttribute( 'aria-label', name );
	return button;
};

const addNewLanguage = ( value ) => {
	const newItem = createItemNode( value );

	addItemToBoard( newItem );
};

const addItemListeners = ( items ) => {

	// Add item event listeners
	items.forEach( (item) => {
		item.onfocus = () => {	
			updateItemSelectedState( item );
		}
		
		item.onblur = () => {
			updateItemSelectedState( item );
		}

		item.onclick = () => {
			item.focus();
			checkForRemainingItems();
			updateItemSelectedState( item );
			addItemToBoard( item );
		}
		
		item.onkeydown = ( e ) => {
			listenForKeyCodes( item, e );
		}
	});

};

document.addEventListener( 'DOMContentLoaded', () => {

	// TODO: this should be done server-side with a templating language
	initialLanguages.forEach( ( language ) => {
		let item = createItemNode( language );
		inventory.prepend( item );
	});
	
	addItemListeners( document.querySelectorAll( '.js-item' ) );

	// Prepare object of results according to the items' position on the slider.
	document.getElementById( 'submit' ).addEventListener( 'click', ( e ) => {

		e.preventDefault();

		let languageRatingStruct = {
			name: '',
			value: ''
		};

		let entry = {
			user: {},
			data: []
		};

		const sliderBox = slider.getBoundingClientRect();
		const sliderX = sliderBox.x.toFixed();
		const sliderWidth = sliderBox.width.toFixed();

		const getItemCenter = ( item ) => {
			const box = item.getBoundingClientRect();
			const center = ( box.x + box.width / 2 );
			
			return center.toFixed();
		};
		
		const getRatingValueFromPosition = ( item ) => {
			return ( ( ( getItemCenter( item ) - sliderX ) / sliderWidth ) * 100 ).toFixed();
		};

		document.querySelectorAll( '.js-item.is-onboard' ).forEach( el => {
			let rating = Object.assign( {}, languageRatingStruct );
			rating.name = el.textContent;
			rating.value = getRatingValueFromPosition( el );

			// Add to the entry object that will be saved.
			entry.data.push( rating );
		});

		const age = document.getElementById( 'age' );
		const submissionTimestamp = new Date();

		entry.user = {
			time: submissionTimestamp,
			occupation: document.getElementById( 'occupation' ).value,
			mainPL: document.getElementById( 'mainPL' ).value,
			openText: document.getElementById( 'openText' ).value,
			gender: document.querySelector('input[name="gender"]:checked').value,
			age: age.options[age.selectedIndex].value
		};

		// Mark as loading
		form.classList.add( 'a-fade-to-20' );

		// Save to JSBIN
		let req = new XMLHttpRequest();

		const successTemplate = `<div>
			<h3 class="u-font-size-28 a-center">Your response has been recorded. Thank you!</h3>
			<div class="u-padding-tb-2 u-flex a-center">
				<a class="c-button" href="https://twitter.com/intent/tweet?text=Is%20C%20more%20of%20a%20programming%20language%20than%20Java?%20And%20what%20about%20Python?%20Enter%20your%20opinion%20in%20this%20online%20survey%20by%20@laras126%20and%20@felienne">Share our survey on Twitter!</a>
			</div>`;

		req.onreadystatechange = () => {
			if (req.readyState == XMLHttpRequest.DONE) {
				form.classList.remove( 'a-fade-to-20' );
				form.innerHTML = successTemplate;
			}
		};

		req.open( 'POST', 'https://api.jsonbin.io/b', true);
		req.setRequestHeader( 'Content-type', 'application/json' );
		req.setRequestHeader( 'collection-id', '5d73f0ff2d1fb96463c9faa8' );
		req.setRequestHeader( 'secret-key', '$2a$10$i4oSJqC3L35lA04tt774s.VK4ZLs43L9NvsLzmblXoeHu7lUPG6ES' );
		req.send( JSON.stringify( entry ) );

	});

	document.getElementById( 'addLanguage' ).addEventListener( 'submit', ( e ) => {
		e.preventDefault();
		
		addNewLanguage( e.target.querySelector( 'input[type=text]' ).value );
		e.target.querySelector( 'input[type=text]' ).value = '';

		addItemListeners( document.querySelectorAll( '.js-item' ) );
	});
});