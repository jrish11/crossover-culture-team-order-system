(() => {
  const DEFAULT_COLORS = {
    Base: { hex: '#111111', name: 'Black', apply: 'Applies to the main short body and waistband.' },
    Artwork: { hex: '#FFFFFF', name: 'White', apply: 'Applies to the CC logo, piping, and words.' }
  };

  const normalizeHex = (value) => {
    const stripped = value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 6);
    return stripped ? `#${stripped}` : '#';
  };

  const isValidHex = (value) => /^#[0-9A-F]{6}$/.test(value);

  const COLOR_NAME_MAP = {
    '#FFFFFF': 'White',
    '#111111': 'Black',
    '#6E7175': 'Iron Grey',
    '#203A72': 'Team Navy',
    '#2454C6': 'Team Royal',
    '#355B3E': 'Forest Green',
    '#BF2B2B': 'Team Red',
    '#6F263D': 'Maroon',
    '#B89641': 'Gold Yellow',
    '#A7ADB3': 'Silver Grey',
    '#CB6A2D': 'Orange'
  };

  const getColorName = (hex) => COLOR_NAME_MAP[hex] || 'Custom';

  const formatColorLabel = (hex, name) => `${hex} (${name})`;

  const initializeSection = (section) => {
    const minPieces = Math.max(parseInt(section.dataset.minPieces || '6', 10) || 6, 6);
    const adultUnitPriceCents = Math.max(parseInt(section.dataset.adultUnitPriceCents || '0', 10) || 0, 0);
    const youthUnitPriceCents = Math.max(parseInt(section.dataset.youthUnitPriceCents || '0', 10) || 0, 0);
    const sameUnitPrice = adultUnitPriceCents === youthUnitPriceCents;

    const mainImage = section.querySelector('[data-main-image]');
    const thumbnails = Array.from(section.querySelectorAll('[data-gallery-thumb]'));
    const form = section.querySelector('[data-practice-shorts-form]');
    const cartQuantityInput = section.querySelector('[data-cart-quantity]');
    const totalPiecesProperty = section.querySelector('[data-total-pieces-property]');
    const sizeBreakdownProperty = section.querySelector('[data-size-breakdown-property]');
    const adultPiecesProperty = section.querySelector('[data-adult-pieces-property]');
    const youthPiecesProperty = section.querySelector('[data-youth-pieces-property]');
    const calculatedTotalProperty = section.querySelector('[data-calculated-total-property]');
    const quantityInputs = Array.from(section.querySelectorAll('[data-size-quantity]'));
    const sizeBreakdownSummary = section.querySelector('[data-summary-size-breakdown]');
    const livePricingCopy = section.querySelector('[data-live-pricing-copy]');
    const errorMessage = section.querySelector('[data-form-message="error"]');
    const colorPicker = section.querySelector('[data-color-picker]');
    const colorHexInput = section.querySelector('[data-color-hex]');
    const colorPreview = section.querySelector('[data-color-preview]');
    const colorApplyCopy = section.querySelector('[data-color-apply-text]');
    const activeColorDisplay = section.querySelector('[data-active-color-display]');
    const colorTargetButtons = Array.from(section.querySelectorAll('[data-color-target-button]'));
    const resetColorsButton = section.querySelector('[data-reset-colors]');
    const addToCartButton = section.querySelector('[data-add-to-cart]');
    const submittingLabel = addToCartButton?.dataset.submittingLabel || 'Adding Practice Shorts Order...';
    const totalPiecesSummary = section.querySelector('[data-summary-total-pieces]');
    const estimatedTotalSummaries = Array.from(section.querySelectorAll('[data-summary-estimated-total]'));
    const colorPropertyInputs = {
      Base: section.querySelector('[data-color-property="Base"]'),
      Artwork: section.querySelector('[data-color-property="Artwork"]')
    };
    const colorSummaryValues = {
      Base: section.querySelector('[data-color-summary="Base"] .shooting-shirt-section__color-summary-value'),
      Artwork: section.querySelector('[data-color-summary="Artwork"] .shooting-shirt-section__color-summary-value')
    };
    const orderSummaryColors = {
      Base: section.querySelector('[data-summary-color="Base"]'),
      Artwork: section.querySelector('[data-summary-color="Artwork"]')
    };

    const colorState = {
      Base: { ...DEFAULT_COLORS.Base },
      Artwork: { ...DEFAULT_COLORS.Artwork }
    };

    let activeColorTarget = 'Base';

    const getApplyCopy = (target) => {
      const matchingButton = colorTargetButtons.find((button) => button.dataset.colorTarget === target);
      return matchingButton?.dataset.colorApplyCopy || DEFAULT_COLORS[target].apply;
    };

    colorState.Base.apply = getApplyCopy('Base');
    colorState.Artwork.apply = getApplyCopy('Artwork');

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

    const buildSizeBreakdown = () => quantityInputs.reduce((entries, input) => {
      const quantity = parseInt(input.value || '0', 10) || 0;
      if (quantity > 0) {
        entries.push(`${input.dataset.sizeLabel} x ${quantity}`);
      }
      return entries;
    }, []);

    const formatMoney = (cents) => {
      const amount = cents / 100;
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    };

    const getPricingState = () => quantityInputs.reduce((state, input) => {
      const quantity = Math.max(parseInt(input.value || '0', 10) || 0, 0);
      if (quantity <= 0) {
        return state;
      }

      if (input.dataset.priceTier === 'Youth') {
        state.youthPieces += quantity;
        state.totalCents += quantity * youthUnitPriceCents;
      } else {
        state.adultPieces += quantity;
        state.totalCents += quantity * adultUnitPriceCents;
      }

      return state;
    }, {
      adultPieces: 0,
      youthPieces: 0,
      totalCents: 0
    });

    const updateSizeBreakdownSummary = () => {
      const sizeEntries = buildSizeBreakdown();
      const summaryText = sizeEntries.length ? sizeEntries.join(' | ') : 'No sizes entered yet';
      sizeBreakdownProperty.value = sizeEntries.join(' | ');
      sizeBreakdownSummary.textContent = summaryText;
    };

    const syncPricingState = () => {
      const pricingState = getPricingState();
      const totalPieces = pricingState.adultPieces + pricingState.youthPieces;
      const formattedTotal = formatMoney(pricingState.totalCents);

      adultPiecesProperty.value = String(pricingState.adultPieces);
      youthPiecesProperty.value = String(pricingState.youthPieces);
      calculatedTotalProperty.value = formattedTotal;
      estimatedTotalSummaries.forEach((summary) => {
        summary.textContent = formattedTotal;
      });

      if (livePricingCopy) {
        if (totalPieces > 0) {
          livePricingCopy.textContent = sameUnitPrice
            ? `${totalPieces} total pieces = ${formattedTotal} order total.`
            : `${pricingState.adultPieces} mens / womens + ${pricingState.youthPieces} youth = ${formattedTotal} estimated total.`;
        } else {
          livePricingCopy.textContent = sameUnitPrice
            ? 'Order total updates as sizes are entered. Shopify checkout quantity syncs to total pieces.'
            : 'Estimated total updates as sizes are entered.';
        }
      }

      cartQuantityInput.value = String(sameUnitPrice && totalPieces > 0 ? totalPieces : 1);
    };

    const updateTotalPieces = () => {
      const total = quantityInputs.reduce((sum, input) => {
        const quantity = Math.max(parseInt(input.value || '0', 10) || 0, 0);
        return sum + quantity;
      }, 0);

      totalPiecesProperty.value = String(total);
      totalPiecesSummary.textContent = `${total} piece${total === 1 ? '' : 's'}`;
      updateSizeBreakdownSummary();
      syncPricingState();
    };

    const refreshColorEditor = () => {
      const current = colorState[activeColorTarget];

      colorTargetButtons.forEach((button) => {
        const isActive = button.dataset.colorTarget === activeColorTarget;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      activeColorDisplay.textContent = formatColorLabel(current.hex, current.name);
      colorApplyCopy.textContent = current.apply;
      colorHexInput.value = current.hex;
      colorPicker.value = isValidHex(current.hex) ? current.hex : '#000000';
      colorPreview.style.backgroundColor = isValidHex(current.hex) ? current.hex : '#FFFFFF';
    };

    const commitColorState = (target, rawHex, forcedName) => {
      const normalizedHex = normalizeHex(rawHex);
      const valid = isValidHex(normalizedHex);
      const name = forcedName || (valid ? getColorName(normalizedHex) : 'Custom');
      const label = valid ? formatColorLabel(normalizedHex, name) : 'Invalid HEX';

      colorState[target].hex = normalizedHex;
      colorState[target].name = name;
      colorPropertyInputs[target].value = valid ? formatColorLabel(normalizedHex, name) : '';
      colorSummaryValues[target].textContent = label;
      orderSummaryColors[target].textContent = label;
      refreshColorEditor();
    };

    const resetColors = () => {
      Object.keys(DEFAULT_COLORS).forEach((target) => {
        colorState[target] = { ...DEFAULT_COLORS[target], apply: getApplyCopy(target) };
        colorPropertyInputs[target].value = formatColorLabel(DEFAULT_COLORS[target].hex, DEFAULT_COLORS[target].name);
        colorSummaryValues[target].textContent = formatColorLabel(DEFAULT_COLORS[target].hex, DEFAULT_COLORS[target].name);
        orderSummaryColors[target].textContent = formatColorLabel(DEFAULT_COLORS[target].hex, DEFAULT_COLORS[target].name);
      });

      activeColorTarget = 'Base';
      refreshColorEditor();
    };

    const validateForm = () => {
      clearFieldErrors();
      setMessage(null);

      let isValid = true;
      const sizeEntries = buildSizeBreakdown();
      const totalPieces = parseInt(totalPiecesProperty.value || '0', 10) || 0;

      Object.keys(colorState).forEach((target) => {
        if (!isValidHex(colorState[target].hex) || !colorPropertyInputs[target].value) {
          colorHexInput.classList.add('shooting-shirt-section__field-error');
          isValid = false;
        }
      });

      if (!sizeEntries.length || totalPieces < minPieces) {
        quantityInputs.forEach((input) => {
          input.classList.add('shooting-shirt-section__field-error');
        });
        isValid = false;
      }

      if (!isValid) {
        setMessage('error', `Please confirm at least ${minPieces} total pieces and choose valid colors before adding to cart.`);
      }

      return isValid;
    };

    const submitOrder = () => {
      if (!validateForm()) {
        return;
      }

      sizeBreakdownProperty.value = buildSizeBreakdown().join(' | ');
      syncPricingState();
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

    colorTargetButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeColorTarget = button.dataset.colorTarget || 'Base';
        refreshColorEditor();
      });
    });

    colorPicker.addEventListener('input', () => {
      commitColorState(activeColorTarget, colorPicker.value);
    });

    colorHexInput.addEventListener('input', () => {
      commitColorState(activeColorTarget, colorHexInput.value);
    });

    colorHexInput.addEventListener('blur', () => {
      commitColorState(activeColorTarget, colorHexInput.value);
    });

    if (resetColorsButton) {
      resetColorsButton.addEventListener('click', resetColors);
    }

    quantityInputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('shooting-shirt-section__field-error');
        const nextValue = Math.min(Math.max(parseInt(input.value || '0', 10) || 0, 0), 99);
        input.value = nextValue === 0 ? '' : String(nextValue);
        updateTotalPieces();
      });
    });

    updateTotalPieces();
    refreshColorEditor();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitOrder();
    });
  };

  document.querySelectorAll('[data-practice-shorts-form]').forEach((form) => {
    const section = form.closest('.shooting-shirt-section');
    if (section) {
      initializeSection(section);
    }
  });
})();
