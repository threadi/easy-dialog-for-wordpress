# Easy Dialog for WordPress

This script enables the output of modal dialogs in the WordPress backend. It is fully flexible and can be used for a wide variety of applications.

![Easy Dialog for WordPress Example](https://www.thomaszwirner.de/wp-content/uploads/2026/02/easy-dialog-for-wordpress-demo-dialog.png)

This is the repository for the script. The target group is developers of WordPress plugins and themes. Regular WordPress users should contact their technical support person if they have any questions.

## Requirements to use this package

* _composer_ to install this package.
* _npm_ to compile the scripts.
* WordPress plugin, theme or a _Code Snippet_-plugin to embed it in your project.

## Installation

1. ``composer require threadi/easy-dialog-for-wordpress``
2. Switch to ``vendor/thread/easy-dialog-for-wordpress``
3. Run ``npm i`` to install dependencies.
4. Run ``npm run build`` to compile the scripts.
5. Add the codes from `doc/embed.php` to your WordPress plugin or theme.

## Configuration

Any dialog is configured with the following options as an array (each is optional):

* callback
  * a JS-callback which is called if the dialog is mounted
* className
  * string with names the modal should become to set individual styles
* title
  * represents the title as a single text
* texts
  * array of texts for the dialog
  * each entry contains a single string
* buttons
  * array of buttons for the dialog
  * each entry is an array with the following settings:
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
    * value set to `true` to close the dialog on click outside the dialog
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

You can customize the output of the dialog with your custom CSS.

E.g.:

```
body.easy-dialog-for-wordpress.wp-core-ui .components-modal__frame.easy-dialog {
 background-color: red;
}
```

## FAQ

### Which WordPress version is required?

The lowest tested version is WordPress 5.9.

### How to simply close the active dialog?

Use this JavaScript function: `closeDialog();`

### Is it possible to create multiple dialogs on one screen?

No, you will be able to show only one dialog at the same time.

### How to open a new dialog after the click on a button in dialog?

Call your own function as a callback for the button.

Example:
```
'action' => 'open_new_dialog()',
```

```
function open_new_dialog() {
 /* define your new dialog */
}
```

### How to process the result of a button click?

Call your own function as a callback for the button. This function should be contain the way to process the result of the button click.

Example:
```
'action' => 'custom_process_button_click()',
```

```
function custom_process_button_click() {
 /* define how to process the result of the button click */
}
```

Tipp: when you display form fields within the dialog, you can easily collect their values using JavaScript.

Simple example:

```
let my_field_value = jQuery('#yourFieldId').val();
```
