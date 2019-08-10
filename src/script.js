
const listenForKeyCodes = ( item, e ) => {
	if ( 32 === e.keyCode ) {
		slider.appendChild( item );	
		item.focus();
		updateItemOnBoardState( item );
		updateItemSelectedState( item );
		log( item.innerHTML + ' move item to board' );
	}

	// Move Left
	if ( item.classList.contains( 'is-onboard' ) ) {
		const styles = window.getComputedStyle( item );
		const itemX = styles.getPropertyValue( '--positionX' );
		log( typeof parseInt(itemX) );

		let currentX = parseInt(itemX);
		
		if ( 13 === e.keyCode ) {
			const remainingItems = inventory.querySelectorAll( '.js-item');
			
			if ( 0 < remainingItems.length ) {
				inventory.querySelectorAll( '.js-item')[0].focus();
			} else {
				// TODO: this is where we can add more langyages from JSON file.
				finalMessage.removeAttribute( 'hidden' );
			}
			
		}
		
		if( 37 === e.keyCode ) {
			item.style.setProperty( '--positionX',  getNewX( currentX, 'left' ) );
		}

		// Move Right
		if ( 39 === e.keyCode ) {
			item.style.setProperty( '--positionX',  getNewX( currentX, 'right' ) );
		}
	}
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
	let selectedString = '- Selected, spacebar to move to board';
	let itemLabel = item.getAttribute( 'aria-label' );

	if ( document.activeElement == item ) {
			// already selected
			if ( item.classList.contains( 'is-selected' ) ) {
				return;
			}
		
			item.classList.add( 'is-selected' );
			item.setAttribute( 'aria-label', itemLabel +  selectedString );
	} else {
			item.classList.remove( 'is-selected' );
			item.setAttribute( 'aria-label', itemLabel.replace( selectedString, '' ) );
	}
	
	log( item.getAttribute( 'aria-label' ) );
};

const updateItemOnBoardState = ( item ) => {
	const selectedString = ' - Use Left and Right arrows to move item, Enter to submit and go to next item in list';
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
	
	log( item.getAttribute( 'aria-label' ) );
};

const log = c => console.log( c );


document.addEventListener( 'DOMContentLoaded', () => {
	log( 'loaded' );
	const items = document.querySelectorAll( '.js-item' );
	const slider = document.getElementById( 'slider' );
	const inventory = document.getElementById( 'inventory' );
	const finalMessage = document.getElementById( 'finalMessage' );

	items.forEach( (item) => {
		item.onfocus = () => {	
			updateItemSelectedState( item );
		}
		
		item.onblur = () => {
			updateItemSelectedState( item );
		}

		item.onclick = () => {
			item.focus();
			updateItemSelectedState( item );
		}
		
		item.onkeydown = ( e ) => {
			listenForKeyCodes( item, e );
		}
	});

});
