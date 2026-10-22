// Логика модального окна и доступной формы заявки.
(() => {
  const dialog = document.getElementById('order-dialog');
  const form = document.getElementById('order-form');
  const closeButton = document.getElementById('close-order-dialog');
  const selectedProduct = document.getElementById('selected-product');
  const successMessage = document.getElementById('success-message');

  if (!dialog || !form) return;

  const fields = Array.from(form.querySelectorAll('input, select, textarea'))
    .filter((field) => field.type !== 'hidden');
  let previousFocus = null;

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.remove();
  }

  function showFieldError(field) {
    field.setAttribute('aria-invalid', 'true');
    const message = field.validity.valueMissing
      ? 'Заполните это поле.'
      : field.validity.typeMismatch
        ? 'Проверьте формат введённых данных.'
        : field.validity.patternMismatch
          ? 'Введите телефон в формате +7 (900) 000-00-00.'
          : field.validity.tooShort
            ? `Введите не менее ${field.minLength} символов.`
            : 'Проверьте значение этого поля.';
    let error = document.getElementById(`${field.id}-error`);
    if (!error) {
      error = document.createElement('small');
      error.className = 'order-form__error';
      error.id = `${field.id}-error`;
      error.setAttribute('role', 'alert');
      field.insertAdjacentElement('afterend', error);
    }
    error.textContent = message;
    field.setAttribute('aria-describedby', error.id);
  }

  document.querySelectorAll('.product-card__button[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      previousFocus = button;
      if (selectedProduct) selectedProduct.value = button.dataset.product || '';
      if (successMessage) successMessage.hidden = true;
      dialog.showModal();
      const firstField = form.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstField) firstField.focus();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => dialog.close());
  }

  dialog.addEventListener('close', () => {
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
  });

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        clearFieldError(field);
      }
    });
    field.addEventListener('change', () => {
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        clearFieldError(field);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach((field) => {
      clearFieldError(field);
      if (!field.checkValidity()) {
        showFieldError(field);
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.reportValidity();
      return;
    }

    // Демонстрационный сценарий: серверная отправка пока не подключена.
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.setAttribute('role', 'status');
      successMessage.setAttribute('aria-live', 'polite');
      successMessage.textContent = 'Проверка пройдена. Форма готова к отправке; сервер пока не подключён.';
    }
    form.reset();
    fields.forEach(clearFieldError);
    dialog.close();
  });
})();
