export default class FormInput extends HTMLElement {
  // Define observed attributes for property changes
  static get observedAttributes() {
    return [
      'label',
      'type',
      'required',
      'placeholder',
      'value',
      'pattern',
      'min',
      'max',
      'minlength',
      'maxlength',
      'variant',
      'helper-text',
      'error'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create template
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          margin-bottom: 1rem;
        }

        .form-input-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .required-badge {
          color: var(--error-color, #dc2626);
          font-size: 0.75rem;
        }

        input {
          padding: 0.625rem;
          border: 1px solid white;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        /* Variants */
        :host([variant="filled"]) input {
          background-color: var(--filled-bg, #f3f4f6);
          border: none;
        }

        :host([variant="outlined"]) input {
          background-color: transparent;
        }

        /* States */
        input:hover {
          border-color: var(--hover-border-color, #9ca3af);
        }

        input:focus {
          outline: none;
          border-color: var(--focus-border-color, #2563eb);
          box-shadow: 0 0 0 3px var(--focus-ring-color, rgba(37, 99, 235, 0.1));
        }

        :host([error]) input {
          border-color: var(--error-color, #dc2626);
        }

        .helper-text {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .error-text {
          color: var(--error-color, #dc2626);
        }

        .helper-text:not(.error-text) {
          color: var(--helper-text-color, #6b7280);
        }

        /* Disabled state */
        :host([disabled]) {
          opacity: 0.7;
          cursor: not-allowed;
        }

        :host([disabled]) input {
          background-color: var(--disabled-bg, #f3f4f6);
          cursor: not-allowed;
        }
      </style>

      <div class="form-input-container">
        <label>
          <span class="label-text"></span>
          <span class="required-badge" aria-hidden="true"></span>
        </label>
        <input />
        <span class="helper-text"></span>
      </div>
    `;

    this._input = this.shadowRoot.querySelector('input');
    this._label = this.shadowRoot.querySelector('.label-text');
    this._requiredBadge = this.shadowRoot.querySelector('.required-badge');
    this._helperText = this.shadowRoot.querySelector('.helper-text');

    // Bind methods
    this._onInput = this._onInput.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  // Lifecycle callbacks
  connectedCallback() {
    this._input.addEventListener('input', this._onInput);
    this._input.addEventListener('blur', this._onBlur);
    this._upgradeProperty('value');
  }

  disconnectedCallback() {
    this._input.removeEventListener('input', this._onInput);
    this._input.removeEventListener('blur', this._onBlur);
  }

  // Properties
  get value() {
    return this._input.value;
  }

  set value(val) {
    this._input.value = val;
  }

  get valid() {
    return this._input.checkValidity();
  }

  // Attribute handling
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'label':
        this._label.textContent = newValue;
        break;
      case 'required':
        this._input.required = newValue !== null;
        this._requiredBadge.textContent = newValue !== null ? '*' : '';
        break;
      case 'error':
        this._updateErrorState(newValue);
        break;
      case 'helper-text':
        this._updateHelperText(newValue);
        break;
      default:
        // Handle all other attributes
        if (name in this._input) {
          const value = newValue !== null ? newValue : '';
          this._input[name] = value;
        }
    }
  }

  // Private methods
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _onInput(event) {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: {
        value: event.target.value,
        valid: this.valid
      },
      bubbles: true,
      composed: true
    }));
  }

  _onBlur() {
    this.validate();
  }

  _updateErrorState(error) {
    if (error !== null) {
      this._helperText.classList.add('error-text');
      this._input.setAttribute('aria-invalid', 'true');
    } else {
      this._helperText.classList.remove('error-text');
      this._input.removeAttribute('aria-invalid');
    }
  }

  _updateHelperText(text) {
    this._helperText.textContent = text || '';
  }

  // Public methods
  validate() {
    const valid = this._input.checkValidity();
    const validationMessage = this._input.validationMessage;

    if (!valid) {
      this.setAttribute('error', '');
      this.setAttribute('helper-text', validationMessage);
    } else {
      this.removeAttribute('error');
      if (this.getAttribute('helper-text') === validationMessage) {
        this.removeAttribute('helper-text');
      }
    }

    return valid;
  }
}