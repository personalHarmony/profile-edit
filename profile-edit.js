/* eslint-disable max-len */
/* eslint-disable-next-line max-len */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/iron-icons/image-icons.js';
import '@fabricelements/skeleton-image-uploader/skeleton-image-uploader.js';
/**
 * `profile-edit`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ProfileEdit extends PolymerElement {
  /**
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <style is="custom-style">
      :host {
        display: block;
        @apply --layout-flex-none;
        @apply --layout-vertical;
        box-sizing: border-box;
        position: relative;
      }

      #picture-container {
        max-width: 300px;
        padding-top: 1rem;
        margin: 0 auto 2rem auto;
        box-sizing: border-box;
        position: relative;
      }

      #picture-container paper-fab {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        z-index: 2;
      }

      #picture-container {
        --paper-fab-background: white;
        --paper-fab-iron-icon: {
          color: var(--paper-indigo-a700);
        };
      }

      .displayName {
        text-transform: capitalize;
        min-height: 35px;
        line-height: 35px;
        margin-bottom: 0.5rem;
      }

      .profileSummary {
        min-height: 25px;
        line-height: 25px;
        font-weight: 500;
      }

      header {
        @apply --layout-flex-auto;
        @apply --layout-vertical;
        @apply --layout-center-justified;
        background-color: var(--paper-indigo-a200);
        padding: 1rem;
        box-sizing: border-box;
        min-height: 432px;
      }

      #text {
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
      }

      #body {
        margin: 0 auto 1rem auto;
        padding: 0 1rem;
        @apply --layout-flex-none;
        width: 100%;
        box-sizing: border-box;
        max-width: 700px;
      }

      paper-input {
        margin-bottom: 0.5rem;
      }

      skeleton-image-uploader {
        --progress-overlay-color: var(--paper-green-a400);
      }
    </style>
    <header>
      <div id="top-container">
        <div id="picture-container">
          <skeleton-image-uploader
            circle
            vision="AIzaSyDqtR51PSS-Pr9FSUHAKQGkNiy_cqPA9W4"
            src$="[[profile.avatar]]"
            placeholder="https://p.imgix.net/default.jpg?fit=cut&amp;w=500&amp;h=500"
            content-type="image/jpeg"
            metadata$="[[metadata]]"
            path$="images/user/[[user.uid]]/avatar/1.jpg">
          </skeleton-image-uploader>
          <paper-fab icon="image:photo-camera" on-tap="_capture"></paper-fab>
        </div>
        <!--<div id="text">
          <h2 class="displayName paper-font-headline dark">[[profile.name]]</h2>
          <p class="profileSummary paper-font-subhead dark">[[profile.bio.original]]</p>
        </div>-->
      </div>
    </header>

    <div id="body">
      <paper-input placeholder="Your name"
                   value="{{profile.name}}"
                   maxlength="50"
                   char-counter
                   id="input-name"></paper-input>
      <paper-input placeholder="Tell us about yourself &amp; why you want to play more"
                   value="{{profile.bio.original}}"
                   maxlength="150"
                   char-counter
                   id="description"></paper-input>
    </div>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'profile-edit';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      signedIn: {
        type: Boolean,
        value: false,
      },
      user: {
        type: Object,
        value: {},
        observer: '_userObserver',
      },
      profile: {
        type: Object,
        value: {
          name: null,
          bio: {
            original: null,
          },
        },
      },
      readyToSave: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
        computed: '_computeReady(profile, profile.*)',
      },
      metadata: {
        type: Object,
        value: {},
      },
    };
  }

  /**
   * Ready
   */
  ready() {
    super.ready();
    this.addEventListener('completed',
      (downloadURL) => this._updatePhotoAuth(downloadURL));
  }

  /**
   * connectedCallback
   */
  connectedCallback() {
    super.connectedCallback();
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user ? user : null;
      this.signedIn = !(!user);
    });
  }

  /**
   * Update
   *
   * @private
   */
  update() {
    if (!this.profile.name) return;
    const db = firebase.firestore();
    const ref = db.collection('user').doc(this.user.uid);
    const original = this.profile.bio ? this.profile.bio.original : '';
    ref.set({
      'name': this._toTitleCase(this.profile.name),
      'bio': {
        'original': original,
      },
    }, {
      merge: true,
    }).then(() => {
      this.dispatchEvent(new CustomEvent('alert', {
        detail: {
          text: 'Your profile has been updated',
          time: 2000,
          type: 'basic',
        },
        bubbles: true,
        composed: true,
      }));
      this.dispatchEvent(new CustomEvent('profile-updated', {
        bubbles: true,
        composed: true,
      }));
      let user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this._toTitleCase(this.profile.name),
      }).then(() => {
        // Update successful.
        console.log('User updated');
      }).catch((error) => {
        // An error happened.
        console.error('Error updating Auth: ', error);
        this.dispatchEvent(new CustomEvent('alert', {
          detail: {
            text: 'There was a problem updating your profile on Auth',
            time: 3000,
            type: 'error',
          },
          bubbles: true,
          composed: true,
        }));
      });
    }).catch((error) => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
      this.dispatchEvent(new CustomEvent('alert', {
        detail: {
          text: 'There was a problem updating your profile',
          time: 3000,
          type: 'error',
        },
        bubbles: true,
        composed: true,
      }));
    });
  }

  /**
   * Title case text
   *
   * @param {string} baseText
   * @return {*|void|string|XML}
   * @private
   */
  _toTitleCase(baseText) {
    if (!baseText) return null;
    return baseText.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  /**
   * User observer
   *
   * @param {object} user
   * @private
   */
  _userObserver(user) {
    if (!user || !user.uid) return;
    let db = firebase.firestore();
    db.collection('user').doc(user.uid).onSnapshot((doc) => {
      if (!doc.exists) return;
      this.profile = doc.data();
    });

    this.metadata = {
      customMetadata: {
        type: 'avatar',
        id: 1,
        user: user.uid,
      },
    };
  }

  /**
   * Compute ready to save
   *
   * @param {object} profile
   * @return {boolean}
   * @private
   */
  _computeReady(profile) {
    return !!profile.name;
  }

  /**
   * Update photo on Auth
   * @param {string} downloadURL
   * @private
   */
  _updatePhotoAuth(downloadURL) {
    if (!downloadURL.detail) return;
    let user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: downloadURL.detail,
    }).then(() => {
      // Update successful.
      console.log('User photoURL updated');
    }).catch((error) => {
      // An error happened.
      console.error('Error updating Auth: ', error);
      this.dispatchEvent(new CustomEvent('alert', {
        detail: {
          text: 'There was a problem updating your photoURL on Auth',
          time: 3000,
          type: 'error',
        },
        bubbles: true,
        composed: true,
      }));
    });
  }

  /**
   * Capture picture
   *
   * @private
   */
  _capture() {
    const element = this.shadowRoot.querySelector('skeleton-image-uploader');
    element.capture();
  }
}

window.customElements.define(ProfileEdit.is, ProfileEdit);
