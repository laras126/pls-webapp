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

	document.getElementById( 'addLanguage' ).addEventListener( 'submit', ( e ) => {
		e.preventDefault();
		
		addNewLanguage( e.target.querySelector( 'input[type=text]' ).value );
		e.target.querySelector( 'input[type=text]' ).value = '';

		addItemListeners( document.querySelectorAll( '.js-item' ) );
	});
});