## \<profile-edit\>

`profile-edit` is a [Polymer 3](http://polymer-project.org) and [Firebase](https://firebase.google.com/) element for updating users profile basic info.

## Installation

Install profile-edit with npm

```shell
$ npm install FabricElements/profile-edit --save
```

## Usage

Import it into the `<head>` of your page

```html
<script type="module" src="node_modules/@fabricelements/profile-edit/profile-edit.js"></script>
```

### Example: basic usage

Configure your Firebase app

> See [Firebase](https://firebase.google.com/docs/storage/web/start) docs for more information.

Then add the `profile-edit` element.

```html
<profile-edit ready-to-save="{{readyToSave}}"></profile-edit>
```

### Attributes

* `readyToSave` (boolean) - True when the name exists.
* `signedIn` (boolean) - True if the user is signed in.
* `user` (object) - The user object.
* `profile` (object) - The profile info object.
* `metadata` (object) - The metadata to save along with the image.

## Contributing

Please check [CONTRIBUTING](./CONTRIBUTING.md).

## License

Released under the [BSD 3-Clause License](./LICENSE.md).

