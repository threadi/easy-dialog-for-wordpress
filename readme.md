# Easy Dialog for WordPress

## Hint

This is the successor to _WP Easy Dialog_. The new name became necessary due to the abbreviations used.

### Changes

* wp-easy-dialog => new: easy-dialog

## Requirements

* _composer_ to install this package.
* _npm_ to compile the scripts.
* WordPress-plugin, theme or _Code Snippet_-plugin to embed them in your project.

## Installation

1. ``composer require threadi/easy-dialog-for-wordpress``
2. Switch to ``vendor/thread/easy-dialog-for-wordpress``
3. Run ``npm i`` to install dependencies.
4. Run ``npm run build`` to compile the scripts.
5. Add the codes from `doc/embed.php` to your WordPress-project (plugin or theme).

## Configuration

Any dialog is configured with the following options as array (each is optional):

* className
  * string with names the modal should become to set individual styles
* title
  * represents the title as single text
* texts
  * array of texts for the dialog
  * each entry contains a single string
* buttons
  * array of buttons for the dialog
  * each entry is an array with following settings:
    * action
      * string of JavaScript to run on click
    * href
      * string for href-attribute on the button
    * variant
      * string to define button-styling
      * possible values:
        * primary
        * secondary
      * this setting is optional
    * className
      * string for additional css-class on the button
    * text
      * string for the button-text
* hide_title
    * value set to `true` to hide the title
* isDismissible
    * value set to `true` to show X to close the dialog
* shouldCloseOnClickOutside
    * value set to `true` to close the dialog on click outside of the dialog
* shouldCloseOnEsc
    * value set to `true` to close the dialog via key "esc"

## Usage

### PHP

### Example 1

```
$dialog = array(
	'title' => 'My title',
	'texts' => array(
		'<p>My text</p>'
	),
	'buttons' => array(
		array(
			'action' => 'alert("ok");',
			'variant' => 'primary',
			'text' => 'Click here'
		),
	)
);
echo '<a href="#" class="wp-easy-dialog" data-dialog="'.esc_attr(wp_json_encode($dialog)).'">Some link</a>';
```

### Example 2

```
$dialog = array(
	'title' => 'My title',
	'texts' => array(
		'<p>My text</p>'
	),
	'buttons' => array(
		array(
			'action' => 'alert("ok");',
			'variant' => 'primary',
			'text' => 'Click here'
		),
	)
);

// define dialog settings.
$dialog_settings = array(
    'shouldCloseOnEsc' => true
);
echo '<a href="#" class="easy-dialog-for-wordpress" data-dialog="'.esc_attr(wp_json_encode($dialog)).'" data-dialog-settings="'.esc_attr(wp_json_encode($dialog_settings)).'">Some link</a>';
```

### JavaScript

### Example

```
let dialog = array(
	'title' => 'My title',
	'texts' => array(
		'<p>My text</p>'
	),
	'buttons' => array(
		array(
			'action' => 'alert("ok");',
			'variant' => 'primary',
			'text' => 'Click here'
		),
	)
);
document.body.dispatchEvent( new CustomEvent( "easy-dialog-for-wordpress", { detail: dialog } ) );
```

## Custom styles

You can customize the output of the dialog with your custom css.

E.g.:

```
body.easy-dialog-for-wordpress.wp-core-ui .components-modal__frame.easy-dialog {
 background-color: red;
}
```

## FAQ

### Which WordPress version is required?

Lowest tested version is WordPress 5.9.

### How to simply close the active dialog?

Use this JS-function: `closeDialog();`

### Is it possible to create multiple dialogs on one screen?

No, you will be able to show only 1 dialog at same time.

### How to open a new dialog after click on dialog-button?

Call your own function as callback for the button.

Example:
```
'action' => 'open_new_dialog()',
```

```
function open_new_dialog() {
 /* define your new dialog */
}
```
