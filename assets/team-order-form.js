(() => {
  const PRESET_COLORS = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#111111' },
    { name: 'Royal Blue', value: '#003DA5' },
    { name: 'Navy', value: '#001F5B' },
    { name: 'Forest Green', value: '#1E6B3A' },
    { name: 'Red', value: '#C8102E' },
    { name: 'Maroon', value: '#6F263D' }
  ];

  const DEFAULT_COLORS = {
    Main: { hex: '#FFFFFF', name: 'White', apply: 'Applies to the jersey body and shorts body.' },
    Number: { hex: '#111111', name: 'Black', apply: 'Applies to front and back numbers.' },
    Alt: { hex: '#003DA5', name: 'Royal Blue', apply: 'Applies to trim, piping, and secondary accents.' }
  };

  const VECTOR_EXTENSIONS = ['svg', 'ai', 'eps'];

  const sizeOptionsMarkup = `
    <option value="">Select size</option>
    <optgroup label="Youth">
      <option value="Youth YXS">YXS</option>
      <option value="Youth YS">YS</option>
      <option value="Youth YM">YM</option>
      <option value="Youth YL">YL</option>
      <option value="Youth YXL">YXL</option>
    </optgroup>
    <optgroup label="Women's">
      <option value="Women's WXS">WXS</option>
      <option value="Women's WS">WS</option>
      <option value="Women's WM">WM</option>
      <option value="Women's WL">WL</option>
      <option value="Women's WXL">WXL</option>
      <option value="Women's W2XL">W2XL</option>
    </optgroup>
    <optgroup label="Men's">
      <option value="Men's XS">XS</option>
      <option value="Men's S">S</option>
      <option value="Men's M">M</option>
      <option value="Men's L">L</option>
      <option value="Men's XL">XL</option>
      <option value="Men's 2XL">2XL</option>
      <option value="Men's 3XL">3XL</option>
    </optgroup>
  `;

  const normalizeHex = (value) => {
    const stripped = value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 6);
    return stripped ? `#${stripped}` : '#';
  };

  const isValidHex = (value) => /^#[0-9A-F]{6}$/.test(value);

  const getColorName = (hex) => PRESET_COLORS.find((color) => color.value === hex)?.name || 'Custom';

  const formatColorLabel = (hex, name) => `${hex} (${name})`;

  const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const createRosterRow = (index, sectionId) => {
    const row = document.createElement('tr');
    row.className = 'team-order-section__roster-row';
    row.setAttribute('data-player-row', '');

    row.innerHTML = `
      <td class="team-order-section__roster-index" data-player-index>${index}</td>
      <td>
        <label class="visually-hidden" for="PlayerLastName-${sectionId}-${index}">Player ${index} last name</label>
        <input
          id="PlayerLastName-${sectionId}-${index}"
          class="team-order-section__text-input"
          type="text"
          maxlength="12"
          autocomplete="off"
          placeholder="Last Name"
          data-player-last-name
        >
      </td>
      <td>
        <label class="visually-hidden" for="PlayerNumber-${sectionId}-${index}">Player ${index} number</label>
        <input
          id="PlayerNumber-${sectionId}-${index}"
          class="team-order-section__text-input"
          type="number"
          min="0"
          max="99"
          inputmode="numeric"
          placeholder="00"
          data-player-number
        >
      </td>
      <td>
        <label class="visually-hidden" for="PlayerSize-${sectionId}-${index}">Player ${index} size</label>
        <select id="PlayerSize-${sectionId}-${index}" class="team-order-section__select-input" data-player-size>
          ${sizeOptionsMarkup}
        </select>
      </td>
      <td class="team-order-section__roster-remove-cell">
        <button type="button" class="team-order-section__remove-row" data-remove-player aria-label="Remove player ${index}">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM7 10h2v8H7v-8Zm-1 11h12l1-13H5l1 13Z" fill="currentColor"></path>
          </svg>
        </button>
      </td>
    `;

    return row;
  };

  const initializeSection = (section) => {
    const sectionId = section.dataset.sectionId || 'section';
    const minPlayers = Math.max(parseInt(section.dataset.minPlayers || '6', 10) || 6, 6);

    const mainImage = section.querySelector('[data-main-image]');
    const thumbnails = Array.from(section.querySelectorAll('[data-gallery-thumb]'));
    const form = section.querySelector('[data-team-order-form]');
    const teamNameInput = section.querySelector('[data-team-name]');
    const teamNameCount = section.querySelector('[data-team-name-count]');
    const rosterBody = section.querySelector('[data-roster-body]');
    const addPlayerButton = section.querySelector('[data-add-player]');
    const addToCartButton = section.querySelector('[data-add-to-cart]');
    const cartQuantityInput = section.querySelector('[data-cart-quantity]');
    const rosterPropertyInput = section.querySelector('[data-roster-property]');
    const playerCountPropertyInput = section.querySelector('[data-player-count-property]');
    const styleInput = section.querySelector('[data-style-value]');
    const styleButtons = Array.from(section.querySelectorAll('[data-style-button]'));
    const uploadInput = section.querySelector('[data-vector-upload]');
    const errorMessage = section.querySelector('[data-form-message="error"]');
    const colorPicker = section.querySelector('[data-color-picker]');
    const colorHexInput = section.querySelector('[data-color-hex]');
    const colorPreview = section.querySelector('[data-color-preview]');
    const colorApplyCopy = section.querySelector('[data-color-apply-copy]');
    const activeColorDisplay = section.querySelector('[data-active-color-display]');
    const colorTargetButtons = Array.from(section.querySelectorAll('[data-color-target-button]'));
    const colorSwatches = Array.from(section.querySelectorAll('[data-color-swatch]'));
    const resetColorsButton = section.querySelector('[data-reset-colors]');
    const uploadName = section.querySelector('[data-upload-name]');
    const colorPropertyInputs = {
      Main: section.querySelector('[data-color-property="Main"]'),
      Number: section.querySelector('[data-color-property="Number"]'),
      Alt: section.querySelector('[data-color-property="Alt"]')
    };
    const colorSummaryValues = {
      Main: section.querySelector('[data-color-summary="Main"] .team-order-section__color-summary-value'),
      Number: section.querySelector('[data-color-summary="Number"] .team-order-section__color-summary-value'),
      Alt: section.querySelector('[data-color-summary="Alt"] .team-order-section__color-summary-value')
    };

    const colorState = {
      Main: { ...DEFAULT_COLORS.Main },
      Number: { ...DEFAULT_COLORS.Number },
      Alt: { ...DEFAULT_COLORS.Alt }
    };

    let activeColorTarget = 'Main';

    const setMessage = (type, message) => {
      if (type === 'error') {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
        return;
      }

      errorMessage.hidden = true;
    };

    const clearFieldErrors = () => {
      section.querySelectorAll('.team-order-section__field-error').forEach((field) => {
        field.classList.remove('team-order-section__field-error');
      });
    };

    const getRows = () => Array.from(rosterBody.querySelectorAll('[data-player-row]'));

    const updateTeamNameCount = () => {
      teamNameCount.textContent = `${teamNameInput.value.length}/15`;
    };

    const updateAddPlayerButton = () => {
      const count = getRows().length;
      if (count < minPlayers) {
        addPlayerButton.textContent = `+ Add player ${count + 1} of ${minPlayers}`;
        return;
      }
      addPlayerButton.textContent = '+ Add Another Player';
    };

    const updateRemoveButtons = () => {
      const disableRemoval = getRows().length <= 1;
      section.querySelectorAll('[data-remove-player]').forEach((button) => {
        button.disabled = disableRemoval;
      });
    };

    const updateRowIndexes = () => {
      getRows().forEach((row, index) => {
        const displayIndex = index + 1;
        const indexCell = row.querySelector('[data-player-index]');
        const lastNameInput = row.querySelector('[data-player-last-name]');
        const numberInput = row.querySelector('[data-player-number]');
        const sizeSelect = row.querySelector('[data-player-size]');
        const removeButton = row.querySelector('[data-remove-player]');
        const labels = row.querySelectorAll('label');

        indexCell.textContent = String(displayIndex);
        lastNameInput.id = `PlayerLastName-${sectionId}-${displayIndex}`;
        numberInput.id = `PlayerNumber-${sectionId}-${displayIndex}`;
        sizeSelect.id = `PlayerSize-${sectionId}-${displayIndex}`;

        if (labels[0]) {
          labels[0].htmlFor = lastNameInput.id;
        }
        if (labels[1]) {
          labels[1].htmlFor = numberInput.id;
        }
        if (labels[2]) {
          labels[2].htmlFor = sizeSelect.id;
        }
        if (removeButton) {
          removeButton.setAttribute('aria-label', `Remove player ${displayIndex}`);
        }
      });

      updateAddPlayerButton();
      updateRemoveButtons();
    };

    const handleLastNameInput = (input) => {
      input.value = input.value.toUpperCase().replace(/[^A-Z\s'-]/g, '').slice(0, 12);
    };

    const handleNumberInput = (input) => {
      input.value = input.value.replace(/\D/g, '').slice(0, 2);
    };

    const clampNumberInput = (input) => {
      if (input.value === '') {
        return;
      }

      const number = Math.min(Math.max(parseInt(input.value, 10), 0), 99);
      input.value = String(number);
    };

    const attachRowHandlers = (row) => {
      const lastNameInput = row.querySelector('[data-player-last-name]');
      const numberInput = row.querySelector('[data-player-number]');
      const removeButton = row.querySelector('[data-remove-player]');

      lastNameInput.addEventListener('input', () => handleLastNameInput(lastNameInput));
      numberInput.addEventListener('input', () => handleNumberInput(numberInput));
      numberInput.addEventListener('blur', () => clampNumberInput(numberInput));

      removeButton.addEventListener('click', () => {
        if (getRows().length <= 1) {
          return;
        }

        row.remove();
        updateRowIndexes();
        setMessage(null);
      });
    };

    const addPlayerRow = () => {
      const nextIndex = getRows().length + 1;
      const row = createRosterRow(nextIndex, sectionId);
      rosterBody.appendChild(row);
      attachRowHandlers(row);
      updateRowIndexes();
    };

    const refreshSwatches = () => {
      const current = colorState[activeColorTarget];
      colorSwatches.forEach((swatch) => {
        const isMatch = swatch.dataset.colorValue === current.hex && swatch.dataset.colorName === current.name;
        swatch.classList.toggle('is-active', isMatch);
        swatch.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
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
      refreshSwatches();
    };

    const syncColorProperties = () => {
      Object.keys(colorState).forEach((target) => {
        const current = colorState[target];
        const value = isValidHex(current.hex) ? formatColorLabel(current.hex, current.name) : '';
        colorPropertyInputs[target].value = value;
        colorSummaryValues[target].textContent = value || 'Invalid HEX';
      });
    };

    const commitColorState = (target, rawHex, forcedName) => {
      const normalizedHex = normalizeHex(rawHex);
      const name = forcedName || (isValidHex(normalizedHex) ? getColorName(normalizedHex) : 'Custom');

      colorState[target].hex = normalizedHex;
      colorState[target].name = name;
      syncColorProperties();
      refreshColorEditor();
    };

    const resetColors = () => {
      Object.keys(DEFAULT_COLORS).forEach((target) => {
        colorState[target] = { ...DEFAULT_COLORS[target] };
      });

      activeColorTarget = 'Main';
      syncColorProperties();
      refreshColorEditor();
    };

    const validateVectorUpload = () => {
      if (!uploadInput.files || !uploadInput.files.length) {
        uploadName.textContent = 'No file selected';
        return false;
      }

      const file = uploadInput.files[0];
      const extension = getFileExtension(file.name);
      if (!VECTOR_EXTENSIONS.includes(extension)) {
        return false;
      }

      uploadName.textContent = file.name;
      return true;
    };

    const buildRosterEntries = () => getRows().map((row, index) => {
      const lastName = row.querySelector('[data-player-last-name]').value.trim().toUpperCase();
      const number = row.querySelector('[data-player-number]').value.trim();
      const size = row.querySelector('[data-player-size]').value.trim();
      return `${index + 1}. ${lastName} #${number} ${size}`;
    });

    const syncRosterProperties = () => {
      const rosterEntries = buildRosterEntries();
      rosterPropertyInput.value = rosterEntries.join(' | ');
      playerCountPropertyInput.value = String(rosterEntries.length);
      cartQuantityInput.value = String(Math.max(rosterEntries.length, 1));
      return rosterEntries;
    };

    const validateForm = () => {
      clearFieldErrors();
      setMessage(null);
      syncColorProperties();

      let isValid = true;

      if (!teamNameInput.value.trim()) {
        teamNameInput.classList.add('team-order-section__field-error');
        isValid = false;
      }

      Object.keys(colorState).forEach((target) => {
        if (!isValidHex(colorState[target].hex) || !colorPropertyInputs[target].value) {
          colorHexInput.classList.add('team-order-section__field-error');
          isValid = false;
        }
      });

      const rows = getRows();
      if (rows.length < minPlayers) {
        isValid = false;
      }

      rows.forEach((row) => {
        const lastNameInput = row.querySelector('[data-player-last-name]');
        const numberInput = row.querySelector('[data-player-number]');
        const sizeSelect = row.querySelector('[data-player-size]');
        const numberValue = numberInput.value.trim();
        const parsedNumber = Number(numberValue);

        if (!lastNameInput.value.trim()) {
          lastNameInput.classList.add('team-order-section__field-error');
          isValid = false;
        }

        if (numberValue === '' || Number.isNaN(parsedNumber) || parsedNumber < 0 || parsedNumber > 99) {
          numberInput.classList.add('team-order-section__field-error');
          isValid = false;
        }

        if (!sizeSelect.value.trim()) {
          sizeSelect.classList.add('team-order-section__field-error');
          isValid = false;
        }
      });

      if (!validateVectorUpload()) {
        uploadInput.classList.add('team-order-section__field-error');
        isValid = false;
      }

      if (!isValid) {
        setMessage('error', `Please complete all player information, confirm at least ${minPlayers} players, and upload one vector logo file before adding to cart.`);
      }

      return isValid;
    };

    const submitOrder = () => {
      if (!validateForm()) {
        return;
      }

      syncRosterProperties();
      syncColorProperties();

      addToCartButton.disabled = true;
      addToCartButton.textContent = 'Adding Team Order...';
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

    teamNameInput.addEventListener('input', updateTeamNameCount);
    updateTeamNameCount();

    colorTargetButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeColorTarget = button.dataset.colorTarget || 'Main';
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

    colorSwatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        commitColorState(activeColorTarget, swatch.dataset.colorValue || '#FFFFFF', swatch.dataset.colorName || 'Custom');
      });
    });

    if (resetColorsButton) {
      resetColorsButton.addEventListener('click', resetColors);
    }

    styleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.styleOption || 'Home';
        styleInput.value = value;
        styleButtons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      });
    });

    getRows().forEach((row) => {
      attachRowHandlers(row);
    });
    updateRowIndexes();
    syncColorProperties();
    refreshColorEditor();

    addPlayerButton.addEventListener('click', addPlayerRow);

    uploadInput.addEventListener('change', () => {
      uploadInput.classList.remove('team-order-section__field-error');
      if (!validateVectorUpload()) {
        uploadName.textContent = 'Vector files only: SVG, AI, EPS';
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitOrder();
    });
  };

  document.querySelectorAll('.team-order-section').forEach(initializeSection);
})();
