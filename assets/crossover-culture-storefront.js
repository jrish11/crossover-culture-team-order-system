(() => {
  const setupReveal = (root) => {
    const revealNodes = Array.from(root.querySelectorAll("[data-cc-reveal]"));
    if (!revealNodes.length || typeof IntersectionObserver === "undefined") {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  };

  const setupNav = (root) => {
    const drawer = root.querySelector("[data-cc-drawer]");
    const backdrop = root.querySelector("[data-cc-drawer-backdrop]");
    const openButton = root.querySelector("[data-cc-nav-toggle]");
    const closeButton = root.querySelector("[data-cc-drawer-close]");

    if (!drawer || !backdrop || !openButton || !closeButton) {
      return;
    }

    const setState = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      backdrop.classList.toggle("is-open", isOpen);
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
      openButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("cc-shell-drawer-open", isOpen);
    };

    openButton.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      setState(!isOpen);
    });
    closeButton.addEventListener("click", () => setState(false));
    backdrop.addEventListener("click", () => setState(false));

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setState(false);
      }
    });
  };

  const setupGallery = (root) => {
    root.querySelectorAll("[data-cc-gallery]").forEach((gallery) => {
      const mainImage = gallery.querySelector("[data-cc-gallery-main]");
      const thumbButtons = Array.from(gallery.querySelectorAll("[data-cc-gallery-thumb]"));

      if (!mainImage || !thumbButtons.length) {
        return;
      }

      thumbButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const nextSrc = button.dataset.imageSrc;
          const nextAlt = button.dataset.imageAlt || "";

          if (!nextSrc) {
            return;
          }

          mainImage.src = nextSrc;
          mainImage.alt = nextAlt;

          thumbButtons.forEach((thumb) => {
            thumb.classList.remove("is-active");
            thumb.setAttribute("aria-pressed", "false");
          });
          button.classList.add("is-active");
          button.setAttribute("aria-pressed", "true");
        });
      });
    });
  };

  const setupProductForms = (root) => {
    root.querySelectorAll("[data-cc-product-root]").forEach((productRoot) => {
      const jsonNode = productRoot.querySelector("[data-cc-product-json]");
      const addToCartButton = productRoot.querySelector("[data-cc-add-to-cart]");
      const variantInput = productRoot.querySelector("[data-cc-variant-id]");
      const priceNode = productRoot.querySelector("[data-cc-price]");
      const comparePriceNode = productRoot.querySelector("[data-cc-compare-price]");
      const statusNode = productRoot.querySelector("[data-cc-stock-status]");
      const optionFields = Array.from(productRoot.querySelectorAll("[data-cc-option-field]"));

      if (!jsonNode || !addToCartButton || !variantInput) {
        return;
      }

      let productData;
      try {
        productData = JSON.parse(jsonNode.textContent);
      } catch (error) {
        return;
      }

      const moneyFormat = productRoot.dataset.moneyFormat || "${{amount}}";
      const unavailableLabel = addToCartButton.dataset.unavailableLabel || "Unavailable";
      const soldOutLabel = addToCartButton.dataset.soldOutLabel || "Sold out";
      const defaultLabel = addToCartButton.dataset.defaultLabel || "Add to cart";

      const formatMoney = (cents) => {
        const amount = (Number(cents || 0) / 100).toFixed(2);
        return moneyFormat.replace(/\{\{\s*amount\s*\}\}/g, amount);
      };

      const findVariant = () => {
        if (!optionFields.length) {
          return productData.selected_or_first_available_variant || productData.variants?.[0] || null;
        }

        const selectedOptions = optionFields.map((field) => field.value);
        return productData.variants.find((variant) =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
      };

      const updateVariantState = () => {
        const variant = findVariant();

        if (!variant) {
          variantInput.value = "";
          addToCartButton.disabled = true;
          addToCartButton.textContent = unavailableLabel;
          if (statusNode) {
            statusNode.textContent = "No matching variant available";
          }
          return;
        }

        variantInput.value = String(variant.id);
        if (priceNode) {
          priceNode.textContent = formatMoney(variant.price);
        }

        if (comparePriceNode) {
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            comparePriceNode.hidden = false;
            comparePriceNode.textContent = formatMoney(variant.compare_at_price);
          } else {
            comparePriceNode.hidden = true;
          }
        }

        addToCartButton.disabled = !variant.available;
        addToCartButton.textContent = variant.available ? defaultLabel : soldOutLabel;

        if (statusNode) {
          statusNode.textContent = variant.available ? "Ready to ship" : "Currently sold out";
        }
      };

      optionFields.forEach((field) => field.addEventListener("change", updateVariantState));
      updateVariantState();
    });
  };

  const init = () => {
    document.querySelectorAll("[data-cc-shell-root]").forEach((root) => {
      setupReveal(root);
      setupNav(root);
      setupGallery(root);
      setupProductForms(root);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
