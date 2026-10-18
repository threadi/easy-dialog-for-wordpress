/**
 * File to handle the Easy Dialog for WordPress.
 *
 * @package easy-dialog-for-wordpress
 */
import './style.scss';
import { Button, Modal } from '@wordpress/components';
import React from 'react'
import { createRoot } from 'react-dom/client';

/**
 * Generate a custom unique ID.
 *
 * @type {number}
 */
let edfw_id_counter = 0;
const edfw_unique_id = ( prefix = '' ) => `${ prefix }${ ++edfw_id_counter }`;

/**
 * Define close action.
 */
window.closeDialog = () => {
  edfw_hide_dialog();
};

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
    /**
     * Run the callback before the dialog is rendered.
     */
    if( this.props.dialog.callback ) {
      const callbackName = this.props.dialog.callback
        .replace(/\(.*\)?/g, '')
        .replace(/;/g, '')
        .trim();
      const fn = window[callbackName];
      if (typeof fn === 'function') fn();
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
        onRequestClose={ window.closeDialog }
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
              <Button key={button.text} className={button.className} variant={button.variant} onClick={ () => { new Function(button.action)(); } } href={button.href}>
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
 * If dialog already exist it will be closed.
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

  // set ID, if no ID is given.
  if( dialog.id === undefined ) {
    dialog.id = edfw_unique_id( 'edfw-' );
  }

  // hide active dialog.
  edfw_hide_dialog();

  // add this dialog to the list.
  edfw_dialogs[dialog.id] = dialog;

  // create the dialog.
  edfw_dialog = createRoot(top.document.getElementById('easy-dialog-for-wordpress-root'));
  edfw_dialog.render(
    <EDFW_Dialog dialog={dialog}/>
  );
}

/**
 * Hide active dialog.
 */
function edfw_hide_dialog() {
  // bail if no dialog is active.
  if( null === edfw_dialog ) {
    return;
  }

  // remove the dialog.
  edfw_dialog.unmount();
  edfw_dialog = null;
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
 * Make the function usable in button actions, which run in the global scope.
 *
 * Example: 'action' => 'edfw_open_dialog("my-dialog-id");'
 */
window.edfw_open_dialog = edfw_open_dialog;

/**
 * Open the dialog configured in the data attributes of the given element.
 *
 * @param {HTMLElement} element The element with the data-dialog attribute.
 */
function edfw_open_from_element( element ) {
  let dialog;

  try {
    // get the dialog texts.
    dialog = JSON.parse( element.dataset.dialog );

    // get the dialog settings.
    if ( element.dataset.dialogSettings ) {
      // add settings to dialog-object.
      dialog = { ...dialog, ...JSON.parse( element.dataset.dialogSettings ) };
    }
  } catch ( error ) {
    console.error( 'Easy Dialog for WordPress: invalid dialog configuration.', error );
    return;
  }

  // dispatch the event to show the dialog.
  document.body.dispatchEvent( new CustomEvent( 'easy-dialog-for-wordpress', { detail: dialog } ) );
}

/**
 * Register the event listeners only once, even if the script is loaded multiple times
 * (e.g. bundled by different plugins with different script handles).
 */
if ( ! window.edfwLoaded ) {
  window.edfwLoaded = true;

  /**
   * Open the dialog on a click on any element with the class "easy-dialog-for-wordpress"
   * and a data-dialog attribute.
   *
   * The click is delegated to the document, so it also works for elements which are added
   * to the page after the initial page load (e.g. rendered by React or loaded via AJAX).
   */
  document.addEventListener( 'click', (e) => {
    // the [data-dialog] filter is required: the open modal sets the same class on the body.
    const element = e.target instanceof Element ? e.target.closest( '.easy-dialog-for-wordpress[data-dialog]' ) : null;

    // bail if the click was not on a dialog element.
    if (!element) {
      return;
    }

    e.preventDefault();
    edfw_open_from_element( element );
  } );

  /**
   * Add events where the dialog could be fired.
   */
  document.addEventListener( 'DOMContentLoaded', () => {
    /**
     * Add a listener, which could be used to trigger the dialog with given configuration.
     *
     * Example: document.body.dispatchEvent( new CustomEvent( "easy-dialog-for-wordpress", { detail: dialog } ) );
     */
    document.body.addEventListener( 'easy-dialog-for-wordpress', function (attr) {
      if (attr.detail) {
        edfw_add_dialog( attr.detail );
      }
    } );

    /**
     * Listener for reinitialization.
     *
     * Not needed anymore, because the click on dialog elements is delegated to the document.
     * Kept for backward compatibility with code which still dispatches this event.
     *
     * Example: document.body.dispatchEvent( new Event( 'easy-dialog-for-wordpress-reinit' ) );
     */
    document.body.addEventListener( 'easy-dialog-for-wordpress-reinit', function () {
    } );
  } );
}
