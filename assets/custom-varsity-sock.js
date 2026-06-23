(() => {
  const VECTOR_EXTENSIONS = ['svg', 'ai', 'eps'];

  const DEFAULT_COLOR = {
    hex: '#111111',
    name: 'Black',
    code: 'A3-3-BLK'
  };

  const formatColorLabel = (hex, name) => `${hex} (${name})`;

  const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const initializeSection = (section) => {
    const minPieces = Math.max(parseInt(section.dataset.minPieces || '1', 10) || 1, 1);
    const unitPriceCents = Math.max(parseInt(section.dataset.unitPriceCents || '0', 10) || 0, 0);

    const mainImage = section.querySelector('[data-main-image]');
    const thumbnails = Array.from(section.querySelectorAll('[data-gallery-thumb]'));
    const form = section.querySelector('[data-varsity-sock-form]');
    const cartQuantityInput = section.querySelector('[data-cart-quantity]');
    const colorPropertyInput = section.querySelector('[data-color-property]');
    const colorCodePropertyInput = section.querySelector('[data-color-code-property]');
    const sizeBreakdownProperty = section.querySelector('[data-size-breakdown-property]');
    const totalPairsProperty = section.querySelector('[data-total-pairs-property]');
    const calculatedTotalProperty = section.querySelector('[data-calculated-total-property]');
    const quantityInputs = Array.from(section.querySelectorAll('[data-size-quantity]'));
    const colorSelect = section.querySelector('[data-sock-color-select]');
    const resetColorButton = section.querySelector('[data-reset-color]');
    const uploadInput = section.querySelector('[data-vector-upload]');
    const uploadName = section.querySelector('[data-upload-name]');
    const errorMessage = section.querySelector('[data-form-message="error"]');
    const livePricingCopy = section.querySelector('[data-live-pricing-copy]');
    const activeColorDisplay = section.querySelector('[data-active-color-display]');
    const colorSummary = section.querySelector('[data-color-summary]');
    const colorCodeSummary = section.querySelector('[data-color-code-summary]');
    const orderSummaryColor = section.querySelector('[data-summary-color]');
    const orderSummaryColorCode = section.querySelector('[data-summary-color-code]');
    const uploadSummary = section.querySelector('[data-summary-upload]');
    const totalPairsSummary = section.querySelector('[data-summary-total-pairs]');
    const orderTotalSummaries = Array.from(section.querySelectorAll('[data-summary-order-total]'));
    const sizeBreakdownSummary = section.querySelector('[data-summary-size-breakdown]');
    const addToCartButton = section.querySelector('[data-add-to-cart]');
    const submittingLabel = addToCartButton?.dataset.submittingLabel || 'Adding Varsity Sock Order...';

    let colorState = { ...DEFAULT_COLOR };

    const setMessage = (type, message) => {
      if (type === 'error') {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
        return;
      }

      errorMessage.hidden = true;
    };

    const clearFieldErrors = () => {
      section.querySelectorAll('.shooting-shirt-section__field-error').forEach((field) => {
        field.classList.remove('shooting-shirt-section__field-error');
      });
    };

    const formatMoney = (cents) => {
      const amount = cents / 100;
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    };

    const buildSizeBreakdown = () => quantityInputs.reduce((entries, input) => {
      const quantity = parseInt(input.value || '0', 10) || 0;
      if (quantity > 0) {
        entries.push(`${input.dataset.sizeLabel} x ${quantity}`);
      }
      return entries;
    }, []);

    const getTotalPairs = () => quantityInputs.reduce((sum, input) => {
      const quantity = Math.max(parseInt(input.value || '0', 10) || 0, 0);
      return sum + quantity;
    }, 0);

    const syncColorState = () => {
      const label = formatColorLabel(colorState.hex, colorState.name);
      colorPropertyInput.value = label;
      colorCodePropertyInput.value = colorState.code;
      activeColorDisplay.textContent = label;
      colorSummary.textContent = label;
      colorCodeSummary.textContent = colorState.code;
      orderSummaryColor.textContent = label;
      orderSummaryColorCode.textContent = colorState.code;
      if (colorSelect) {
        colorSelect.value = colorState.hex;
      }
    };

    const syncQuantityState = () => {
      const totalPairs = getTotalPairs();
      const sizeEntries = buildSizeBreakdown();
      const formattedTotal = formatMoney(totalPairs * unitPriceCents);

      totalPairsProperty.value = String(totalPairs);
      sizeBreakdownProperty.value = sizeEntries.join(' | ');
      calculatedTotalProperty.value = formattedTotal;
      cartQuantityInput.value = String(Math.max(totalPairs, 1));

      totalPairsSummary.textContent = `${totalPairs} pair${totalPairs === 1 ? '' : 's'}`;
      sizeBreakdownSummary.textContent = sizeEntries.length ? sizeEntries.join(' | ') : 'No sizes entered yet';
      orderTotalSummaries.forEach((node) => {
        node.textContent = formattedTotal;
      });

      if (livePricingCopy) {
        livePricingCopy.textContent = totalPairs > 0
          ? `${totalPairs} total pair${totalPairs === 1 ? '' : 's'} = ${formattedTotal} estimated total before tax and discounts.`
          : 'Estimated total before tax and discounts updates as sizes are entered. Shopify checkout quantity syncs to total pairs.';
      }
    };

    const validateVectorUpload = () => {
      if (!uploadInput.files || !uploadInput.files.length) {
        uploadName.textContent = 'No file selected';
        uploadSummary.textContent = 'No file selected';
        return false;
      }

      const file = uploadInput.files[0];
      const extension = getFileExtension(file.name);
      if (!VECTOR_EXTENSIONS.includes(extension)) {
        uploadName.textContent = 'SVG, AI, or EPS only';
        uploadSummary.textContent = 'Invalid file type';
        return false;
      }

      uploadName.textContent = file.name;
      uploadSummary.textContent = file.name;
      return true;
    };

    const validateForm = () => {
      clearFieldErrors();
      setMessage(null);

      let isValid = true;
      const totalPairs = parseInt(totalPairsProperty.value || '0', 10) || 0;

      if (!colorPropertyInput.value) {
        if (colorSelect) {
          colorSelect.classList.add('shooting-shirt-section__field-error');
        }
        isValid = false;
      }

      if (totalPairs < minPieces) {
        quantityInputs.forEach((input) => {
          input.classList.add('shooting-shirt-section__field-error');
        });
        isValid = false;
      }

      if (!validateVectorUpload()) {
        uploadInput.classList.add('shooting-shirt-section__field-error');
        isValid = false;
      }

      if (!isValid) {
        setMessage('error', `Please choose a sock color, upload one vector logo file, and confirm at least ${minPieces} total pair${minPieces === 1 ? '' : 's'} before adding to cart.`);
      }

      return isValid;
    };

    const submitOrder = () => {
      syncColorState();
      syncQuantityState();

      if (!validateForm()) {
        return;
      }

      addToCartButton.disabled = true;
      addToCartButton.textContent = submittingLabel;
      HTMLFormElement.prototype.submit.call(form);
    };

    if (mainImage && thumbnails.length) {
      thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
          mainImage.src = thumbnail.dataset.imageSrc || mainImage.src;
          mainImage.alt = thumbnail.dataset.imageAlt || mainImage.alt;

          thumbnails.forEach((item) => {
            item.classList.remove('is-active');
            item.setAttribute('aria-selected', 'false');
          });

          thumbnail.classList.add('is-active');
          thumbnail.setAttribute('aria-selected', 'true');
        });
      });
    }

    if (colorSelect) {
      colorSelect.addEventListener('change', () => {
        colorSelect.classList.remove('shooting-shirt-section__field-error');
        const selectedOption = colorSelect.options[colorSelect.selectedIndex];
        colorState = {
          hex: colorSelect.value || DEFAULT_COLOR.hex,
          name: selectedOption?.dataset.colorName || DEFAULT_COLOR.name,
          code: selectedOption?.dataset.colorCode || DEFAULT_COLOR.code
        };
        syncColorState();
      });
    }

    if (resetColorButton) {
      resetColorButton.addEventListener('click', () => {
        colorState = { ...DEFAULT_COLOR };
        syncColorState();
      });
    }

    quantityInputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('shooting-shirt-section__field-error');
        const nextValue = Math.min(Math.max(parseInt(input.value || '0', 10) || 0, 0), 99);
        input.value = nextValue === 0 ? '' : String(nextValue);
        syncQuantityState();
      });
    });

    if (uploadInput) {
      uploadInput.addEventListener('change', () => {
        uploadInput.classList.remove('shooting-shirt-section__field-error');
        validateVectorUpload();
      });
    }

    syncColorState();
    syncQuantityState();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitOrder();
    });
  };

  document.querySelectorAll('[data-varsity-sock-form]').forEach((form) => {
    const section = form.closest('.shooting-shirt-section');
    if (section) {
      initializeSection(section);
    }
  });
})();
