/**
 * File to handle easy dialog for WordPress.
 *
 * @package easy-dialog-for-wordpress
 */
import './style.scss';
import { Button, Modal } from '@wordpress/components';
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom';
import _uniqueId from 'lodash/uniqueId';

/**
 * Define the Easy Dialog for WordPress modal.
 *
 * @returns {JSX.Element}
 * @constructor
 */
class EDFW_Dialog extends React.Component {
	/**
	 * Run callback until component has been mount.
	 */
	componentDidMount() {
		if( this.props.dialog.callback ) {
			eval( this.props.dialog.callback );
		}
	}

	/**
	 * Output rendered dialog, with title, texts and buttons configured by JSON.
	 *
	 * Prepared possible button-actions:
	 * - closeDialog() => closes the dialog
	 */
	render() {
		let args = this.props;

		/**
		 * Define close action.
		 */
		const closeDialog = () => {
      edfw_hide_dialog();
		};

		/**
		 * Define class names.
		 * @type {string}
		 */
		let classNames = "easy-dialog";
		if( this.props.dialog.className ) {
			classNames = "easy-dialog " + this.props.dialog.className;
		}

    /**
     * Set isDismissible initially to false.
     */
    if( args.dialog.isDismissible === undefined ) {
      args.dialog.isDismissible = false;
    }

    /**
     * Set shouldCloseOnClickOutside initially to false.
     */
    if( args.dialog.shouldCloseOnClickOutside === undefined ) {
      args.dialog.shouldCloseOnClickOutside = false;
    }

    /**
     * Set shouldCloseOnEsc initially to false.
     */
    if( args.dialog.shouldCloseOnEsc === undefined ) {
      args.dialog.shouldCloseOnEsc = false;
    }

    /**
     * Set shouldCloseOnEsc initially to false.
     */
    if( args.dialog.hide_title === undefined ) {
      args.dialog.hide_title = false;
    }

		return (
			<Modal
				bodyOpenClassName="easy-dialog-for-wordpress"
				className={ classNames }
				isDismissible={ args.dialog.isDismissible }
				onRequestClose={ closeDialog }
				title={ args.dialog.title }
				shouldCloseOnClickOutside={ args.dialog.shouldCloseOnClickOutside }
				shouldCloseOnEsc={ args.dialog.shouldCloseOnEsc }
				__experimentalHideHeader={ args.dialog.hide_title }
			>
				{args.dialog.texts && args.dialog.texts.map(function(text) {
						return (
							<div key={text} dangerouslySetInnerHTML={{__html: text}} className="easy-dialog-for-wordpress-text" />
						)
					}
				)
				}
				{args.dialog.progressbar && args.dialog.progressbar.active && (
					<div
						className="edfw-progressbar"
					>
						<progress max="100" id={args.dialog.progressbar.id} value={args.dialog.progressbar.progress}>&nbsp;</progress>
						{args.dialog.progressbar.label_id && <p id={args.dialog.progressbar.label_id}></p>}
					</div>
				)}
				{args.dialog.buttons && args.dialog.buttons.map(function(button) {
						return (
							<Button key={button.text} className={button.className} variant={button.variant} onClick={ () => eval(button.action) } href={button.href}>
								{button.text}
							</Button>
						)
					}
				)
				}
			</Modal>
		)
	}
}

/**
 * Show dialog, initiated by any event.
 *
 * If dialog already exist, it will be closed.
 *
 * Erzeuge zu jedem Dialog eine ID, wenn dieser nicht schon eine über seine Settings bekommen hat.
 * Trage jeden Dialog in die Liste aller Dialoge ein.
 * Blende jeden Dialog nur aus, nicht aus DOM entfernen.
 * Vor dem Anzeigen eines neuen Dialogs, suche ob dessen ID schon genutzt wird.
 *
 * @type {null}
 */
let edfw_dialogs = {};
let edfw_dialog = null;

function edfw_add_dialog( dialog ) {
  // bail if no configuration is given.
	if( dialog === undefined ) {
    return;
  }

  // create helper-element.
  if( ! top.document.getElementById('easy-dialog-for-wordpress-root') ) {
    let root = top.document.createElement('div');
    root.id = 'easy-dialog-for-wordpress-root';
    top.document.body.append(root);
  }

  // set id, if no id is given.
  if( dialog.id === undefined ) {
    dialog.id = _uniqueId("edfw-");
  }

  // hide active dialog.
  edfw_hide_dialog();

  // add this dialog to the list.
  edfw_dialogs[dialog.id] = dialog;

  if( ReactDOM.createRoot === undefined ) {
    // old style way: use render.
    const container = top.document.getElementById('easy-dialog-for-wordpress-root');
    render(<EDFW_Dialog dialog={dialog}/>, container);
  }
  else {
    // modern way: use createRoot.
    edfw_dialog = ReactDOM.createRoot(top.document.getElementById('easy-dialog-for-wordpress-root'));
    edfw_dialog.render(
      <EDFW_Dialog dialog={dialog}/>
    );
  }
}

/**
 * Hide active dialog.
 */
function edfw_hide_dialog() {
  // bail if no dialog is active.
  if( edfw_dialog === null ) {
    return;
  }

  if( ReactDOM.createRoot === undefined ) {
    unmountComponentAtNode( top.document.getElementById( 'easy-dialog-for-wordpress-root' ) )
  }
  else {
    edfw_dialog.unmount();
  }
}

/**
 * Open specific dialog.
 *
 * @param id_to_open
 */
function edfw_open_dialog( id_to_open ) {
  for (let id in edfw_dialogs) {
    if( id_to_open === id ) {
      edfw_add_dialog( edfw_dialogs[id] )
    }
  }
}

/**
 * Set the Easy Dialog for WordPress initiator on every element with the class "easy-dialog-for-wordpress".
 */
function edfw_init() {
	let dialog_links = document.getElementsByClassName('easy-dialog-for-wordpress');
	for( let i=0;i<dialog_links.length;i++ ) {
		if( dialog_links[i].dataset.dialog ) {
			dialog_links[i].onclick = function (e) {
				e.preventDefault();

        // get the dialog texts.
        let dialog = JSON.parse( this.dataset.dialog );

        // get the dialog settings.
        if( this.dataset.dialogSettings ) {
          // add settings to dialog-object.
          dialog = { ...dialog, ...JSON.parse( this.dataset.dialogSettings ) };
        }

        // dispatch the event to show the dialog.
				document.body.dispatchEvent( new CustomEvent( "easy-dialog-for-wordpress", { detail: dialog } ) );
			};
		}
	}
}

/**
 * Add events where the dialog could be fired.
 */
document.addEventListener( 'DOMContentLoaded', () => {
  /**
   * Add listener which could be used to trigger the dialog with given configuration.
   *
   * Example: document.body.dispatchEvent( new CustomEvent( "easy-dialog-for-wordpress", { detail: dialog } ) );
   */
	document.body.addEventListener('easy-dialog-for-wordpress', function( attr ) {
		if( attr.detail ) {
      edfw_add_dialog( attr.detail );
		}
	});

  /**
   * Add listener for reinitialization.
   *
   * Example: TODO
   */
	document.body.addEventListener('easy-dialog-for-wordpress-reinit', function() {
    edfw_init();
	});

  /**
   * On each element with the class "easy-dialog".
   */
  edfw_init();
})
