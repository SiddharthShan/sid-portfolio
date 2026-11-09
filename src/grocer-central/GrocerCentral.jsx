// src/grocer-central/GrocerCentral.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./grocer-central.css";

import {
  PRODUCTS,
  INITIAL_CART,
  PROMOS,
  CATEGORIES,
  BUGS,
  getDeliveryDates,
  formatINR,
} from "./grocerData";

import {
  loadGrocerState,
  saveGrocerState,
  clearGrocerState,
} from "./grocerStorage";

const AREAS = [
  "Search",
  "Stock",
  "Cart",
  "Promotions",
  "Delivery",
  "Contact details",
  "Payment",
  "Order submission",
  "Other",
];

const SEVERITIES = ["Critical", "High", "Medium", "Low"];

const EMPTY_REPORT = {
  title: "",
  area: "Search",
  steps: "",
  expected: "",
  actual: "",
  severity: "Medium",
};

function getProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

export default function GrocerCentral({ onExit }) {
  const [page, setPage] = useState("shop");

  // Read saved progress when this instance mounts, so exiting and
  // re-entering the challenge restores the latest state instead of
  // the snapshot taken when the page first loaded.
  const [initialSavedState] = useState(loadGrocerState);

  const [started, setStarted] = useState(
    initialSavedState.started || false
  );

  // The briefing opens every time the challenge is entered.
  const [showBriefing, setShowBriefing] = useState(true);

  const briefStartRef = useRef(null);

  const [completed, setCompleted] = useState(
    initialSavedState.completed || false
  );

  const [cart, setCart] = useState(initialSavedState.cart || INITIAL_CART);

  const [cartBadge, setCartBadge] = useState(
    initialSavedState.cartBadge ?? 4
  );

  const [reports, setReports] = useState(
    initialSavedState.reports || []
  );

  const [discovered, setDiscovered] = useState(
    initialSavedState.discovered || []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const [deliveryDates] = useState(getDeliveryDates);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");

  const [customerName, setCustomerName] = useState("Demo Customer");
  const [customerEmail, setCustomerEmail] = useState("demo@pantrydash.test");
  const [customerPhone, setCustomerPhone] = useState("9876543210");

  const [paymentMethod, setPaymentMethod] = useState("TEST-APPROVE");

  const [orderTotal] = useState(430);
  const [orderCount, setOrderCount] = useState(0);

  const [editingReport, setEditingReport] = useState(null);
  const [reportForm, setReportForm] = useState(EMPTY_REPORT);
  const [reportMessage, setReportMessage] = useState("");

  // Persist challenge data automatically.
  useEffect(() => {
    saveGrocerState({
      reports,
      discovered,
      cart,
      cartBadge,
      started,
      completed,
    });
  }, [reports, discovered, cart, cartBadge, started, completed]);

  // Lock background scrolling while the full-screen app is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Move focus into the briefing as soon as it opens, without scrolling past the title.
  useEffect(() => {
    if (showBriefing) {
      briefStartRef.current?.focus({ preventScroll: true });
    }
  }, [showBriefing]);

  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        product: getProduct(item.productId),
        subtotal: getProduct(item.productId).price * item.quantity,
      })),
    [cart]
  );

  const actualSubtotal = cartItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const currentDelivery = deliveryDates.find(
    (item) => item.value === deliveryDate
  );

  const availableSlots = currentDelivery?.slots || [];

  const score = discovered.length;
  const percentage = Math.round((score / BUGS.length) * 100);

  // ---------------------------
  // Navigation
  // ---------------------------

  function startChallenge() {
    setStarted(true);
    setShowBriefing(false);
    setPage("shop");
  }

  function finishChallenge() {
    const confirmed = window.confirm(
      `Finish the challenge and reveal all ${BUGS.length} planted issues?`
    );

    if (!confirmed) return;

    setCompleted(true);
    setPage("answer");
  }

  function replayChallenge() {
    const confirmed = window.confirm(
      "Replay will clear your cart, QA reports, discovered bugs and challenge progress. Continue?"
    );

    if (!confirmed) return;

    clearGrocerState();

    setPage("shop");
    setStarted(false);
    setShowBriefing(true);
    setCompleted(false);
    setCart(INITIAL_CART);
    setCartBadge(4);
    setReports([]);
    setDiscovered([]);
    setSearch("");
    setCategory("All");
    setFilteredProducts(PRODUCTS);
    setPromoCode("");
    setPromoMessage("");
    setDeliveryDate("");
    setDeliverySlot("");
    setPaymentMethod("TEST-APPROVE");
    setOrderCount(0);
    setReportForm(EMPTY_REPORT);
    setEditingReport(null);
  }

  // ---------------------------
  // Product search and filters
  // ---------------------------

  function handleSearch(value) {
    setSearch(value);

    if (value === "") {
      // Intentional bug #2:
      // The search text clears, but filtered products are not restored.
      return;
    }

    // Intentional bug #1:
    // Case-sensitive search.
    const results = PRODUCTS.filter((product) => {
      const matchesSearch = product.name.includes(value);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(results);
  }

  function handleCategory(value) {
    setCategory(value);

    const results = PRODUCTS.filter((product) => {
      const matchesCategory =
        value === "All" || product.category === value;

      const matchesSearch = product.name.includes(search);

      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(results);
  }

  // ---------------------------
  // Cart operations
  // ---------------------------

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        // Intentional bug #3:
        // Stock availability is not checked.
        return currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { productId: product.id, quantity: 1 }];
    });

    setCartBadge((count) => count + 1);
  }

  function changeQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Intentional bug #4:
    // Line subtotals update, but orderTotal remains unchanged.

    if (change > 0) {
      setCartBadge((count) => count + 1);
    }
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.productId !== productId)
    );

    // Intentional bug #5:
    // The cart badge is not updated after removing an item.
  }

  // ---------------------------
  // Promotions
  // ---------------------------

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();

    if (!PROMOS[code]) {
      setPromoMessage("This promo code is not recognised.");
      return;
    }

    // Intentional bug #7:
    // Expiration is not checked.
    // Intentional bug #6:
    // Valid discount is confirmed but never deducted.
    setPromoMessage(`${code} applied successfully!`);
  }

  // ---------------------------
  // Delivery
  // ---------------------------

  function handleDeliveryDate(value) {
    setDeliveryDate(value);

    // Intentional bug #9:
    // Existing delivery slot is not cleared when the date changes.
  }

  // ---------------------------
  // QA notebook
  // ---------------------------

  function updateReportField(field, value) {
    setReportForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveReport(event) {
    event.preventDefault();

    if (
      !reportForm.title.trim() ||
      !reportForm.steps.trim() ||
      !reportForm.expected.trim() ||
      !reportForm.actual.trim()
    ) {
      setReportMessage("Please complete all required fields.");
      return;
    }

    if (editingReport) {
      setReports((current) =>
        current.map((report) =>
          report.id === editingReport
            ? { ...reportForm, id: editingReport }
            : report
        )
      );

      setReportMessage("Finding updated.");
    } else {
      setReports((current) => [
        ...current,
        {
          ...reportForm,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ]);

      setReportMessage("Finding saved successfully.");
    }

    setReportForm(EMPTY_REPORT);
    setEditingReport(null);
  }

  function editReport(report) {
    setEditingReport(report.id);
    setReportForm({
      title: report.title,
      area: report.area,
      steps: report.steps,
      expected: report.expected,
      actual: report.actual,
      severity: report.severity,
    });

    window.scrollTo(0, 0);
  }

  function deleteReport(reportId) {
    if (!window.confirm("Delete this QA finding?")) return;

    setReports((current) =>
      current.filter((report) => report.id !== reportId)
    );
  }

  function toggleDiscovered(bugId) {
    setDiscovered((current) =>
      current.includes(bugId)
        ? current.filter((id) => id !== bugId)
        : [...current, bugId]
    );
  }

  // ---------------------------
  // Checkout
  // ---------------------------

  function placeOrder() {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      window.alert("Please complete the customer details.");
      return;
    }

    if (!deliveryDate || !deliverySlot) {
      window.alert("Please select a delivery date and time slot.");
      return;
    }

    // Intentional bug #10:
    // Phone number length is not validated.

    // Intentional bug #11:
    // TEST-DECLINE is not handled as a failed payment.

    // Intentional bug #12:
    // There is no duplicate submission protection.
    setOrderCount((count) => count + 1);
  }

  // ---------------------------
  // Small reusable UI pieces
  // ---------------------------

  function goTo(nextPage) {
    setPage(nextPage);
  }

  function renderCartBadge() {
    return <span className="gc-cart-badge">{cartBadge}</span>;
  }

  function renderHeader() {
    return (
      <header className="gc-header">
        <button className="gc-brand" onClick={() => goTo("shop")}>
          <span className="gc-brand-icon">🥬</span>
          <span>
            <strong>Grocer Central</strong>
            <small>Fresh choices. Better living.</small>
          </span>
        </button>

        <div className="gc-header-actions">
          <button
            className="gc-help-button"
            onClick={() => setShowBriefing(true)}
          >
            ❓ How to play
          </button>

          <button className="gc-exit-button" onClick={onExit}>
            Exit challenge
          </button>
        </div>
      </header>
    );
  }

  function renderNavigation() {
    const links = [
      ["shop", "Shop"],
      ["cart", "Cart"],
      ["delivery", "Delivery"],
      ["checkout", "Checkout"],
    ];

    return (
      <nav className="gc-navigation">
        <div className="gc-nav-links">
          {links.map(([key, label]) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              onClick={() => goTo(key)}
            >
              {label}
              {key === "cart" && renderCartBadge()}
            </button>
          ))}
        </div>

        <div className="gc-nav-actions">
          <button
            className={`gc-nav-notebook${page === "notebook" ? " active" : ""}`}
            onClick={() => goTo("notebook")}
          >
            QA Notebook
          </button>

          <button className="gc-finish-button" onClick={finishChallenge}>
            Finish & Reveal
          </button>
        </div>
      </nav>
    );
  }

  function renderBriefing() {
    return (
      <div className="gc-modal-backdrop">
        <div
          className="gc-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gc-briefing-title"
          aria-describedby="gc-briefing-lead"
          onKeyDown={(event) => {
            if (event.key === "Escape") startChallenge();
          }}
        >
          <div className="gc-modal-scroll">
            <div className="gc-eyebrow">INTERACTIVE QA CHALLENGE</div>

            <h1 id="gc-briefing-title">Can you stop a broken release?</h1>

            <p className="gc-lead" id="gc-briefing-lead">
              Grocer Central is almost ready to launch. You are the QA engineer
              responsible for testing the customer shopping journey and
              deciding whether this release is safe to ship.
            </p>

            <h2 className="gc-sr-only">Mission briefing</h2>

            <div className="gc-brief-grid">
              <article className="gc-panel">
                <span className="gc-panel-icon">🎯</span>
                <h3>Your objective</h3>
                <p>
                  Explore the catalogue, add products, apply promotions,
                  schedule delivery and complete checkout. Look for anything
                  that behaves unexpectedly.
                </p>
              </article>

              <article className="gc-panel">
                <span className="gc-panel-icon">🧪</span>
                <h3>Test information</h3>
                <p>
                  Initial basket: 2 Oat Milk, 1 Banana and 1 Eggs. Valid promo:
                  FRESH10. Expired promo: OLD5.
                </p>
              </article>

              <article className="gc-panel">
                <span className="gc-panel-icon">💳</span>
                <h3>Simulated payments</h3>
                <p>
                  TEST-APPROVE and TEST-DECLINE are test-only payment choices.
                  Never enter real payment information.
                </p>
              </article>

              <article className="gc-panel">
                <span className="gc-panel-icon">📝</span>
                <h3>Record your findings</h3>
                <p>
                  Open the QA Notebook to log each issue you find. Finish &
                  Reveal is available whenever you are ready.
                </p>
              </article>
            </div>

            <p className="gc-disclaimer">
              This is a simulated shopping experience. No real orders or
              payments are made.
            </p>
          </div>

          <div className="gc-modal-actions">
            <button
              className="gc-primary-button"
              onClick={startChallenge}
              ref={briefStartRef}
            >
              Start the hunt <span>→</span>
            </button>
            <p className="gc-modal-hint">
              You can reopen these instructions any time with “How to play”.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function renderShop() {
    return (
      <main className="gc-content">
        <div className="gc-page-heading">
          <div>
            <div className="gc-eyebrow">FRESH PICKS, EVERY DAY</div>
            <h1>Good food starts here.</h1>
            <p>Explore our everyday essentials and fresh favourites.</p>
          </div>

          <button className="gc-cart-shortcut" onClick={() => goTo("cart")}>
            🛒 View cart {renderCartBadge()}
          </button>
        </div>

        <div className="gc-search-row">
          <input
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search groceries..."
            aria-label="Search groceries"
          />

          {search && (
            <button
              className="gc-clear-search"
              onClick={() => handleSearch("")}
            >
              Clear
            </button>
          )}
        </div>

        <div className="gc-categories">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => handleCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <h2 className="gc-sr-only">Product catalogue</h2>

        <div className="gc-product-grid">
          {filteredProducts.map((product) => (
            <article className="gc-product-card" key={product.id}>
              <div className="gc-product-art">{product.emoji}</div>

              <div className="gc-product-category">{product.category}</div>
              <h3>{product.name}</h3>

              <div className="gc-product-bottom">
                <strong>{formatINR(product.price)}</strong>
                <span>{product.stock} in stock</span>
              </div>

              <button
                className="gc-add-button"
                onClick={() => addToCart(product)}
              >
                + Add to cart
              </button>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="gc-empty-state">
            <span>🔎</span>
            <h3>No products found</h3>
            <p>Try another search or category.</p>
          </div>
        )}
      </main>
    );
  }

  function renderCart() {
    return (
      <main className="gc-content">
        <div className="gc-eyebrow">YOUR BASKET</div>
        <h1>Shopping cart</h1>
        <h2 className="gc-sr-only">Cart contents</h2>
        <p className="gc-lead">Review your items before continuing.</p>

        <div className="gc-cart-layout">
          <section className="gc-panel gc-cart-list">
            {cartItems.length === 0 && (
              <div className="gc-empty-state">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <button
                  className="gc-primary-button"
                  onClick={() => goTo("shop")}
                >
                  Continue shopping
                </button>
              </div>
            )}

            {cartItems.map((item) => (
              <div className="gc-cart-item" key={item.productId}>
                <div className="gc-cart-emoji">{item.product.emoji}</div>

                <div className="gc-cart-product">
                  <strong>{item.product.name}</strong>
                  <span>{formatINR(item.product.price)} each</span>
                  <span className="gc-line-total">
                    Subtotal: {formatINR(item.subtotal)}
                  </span>
                </div>

                <div className="gc-quantity">
                  <button onClick={() => changeQuantity(item.productId, -1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.productId, 1)}>
                    +
                  </button>
                </div>

                <button
                  className="gc-remove"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <aside className="gc-panel gc-order-summary">
            <h3>Order summary</h3>

            <div className="gc-summary-row">
              <span>Items subtotal</span>
              <strong>{formatINR(actualSubtotal)}</strong>
            </div>

            <div className="gc-summary-row">
              <span>Delivery fee</span>
              <strong>₹40</strong>
            </div>

            <div className="gc-promo">
              <label htmlFor="gc-promo">Promo code</label>
              <div>
                <input
                  id="gc-promo"
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                />
                <button onClick={applyPromo}>Apply</button>
              </div>
              {promoMessage && <small>{promoMessage}</small>}
            </div>

            <div className="gc-summary-total">
              <span>Order total</span>
              <strong>{formatINR(orderTotal)}</strong>
            </div>

            <button
              className="gc-primary-button gc-full-button"
              onClick={() => goTo("delivery")}
            >
              Continue to delivery →
            </button>
          </aside>
        </div>
      </main>
    );
  }

  function renderDelivery() {
    return (
      <main className="gc-content">
        <div className="gc-eyebrow">DELIVERY PREFERENCES</div>
        <h1>When should we deliver?</h1>
        <h2 className="gc-sr-only">Delivery preferences</h2>
        <p className="gc-lead">
          Choose a convenient delivery date and time.
        </p>

        <div className="gc-panel gc-form-panel">
          <label htmlFor="gc-delivery-date">Delivery date</label>

          <input
            id="gc-delivery-date"
            type="date"
            value={deliveryDate}
            onChange={(event) => handleDeliveryDate(event.target.value)}
          />

          <p className="gc-helper">
            Available slots are displayed for the next three days.
          </p>

          {currentDelivery && (
            <>
              <h3>Available time slots</h3>

              <div className="gc-slot-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={deliverySlot === slot ? "selected" : ""}
                    onClick={() => setDeliverySlot(slot)}
                  >
                    🕒 {slot}
                  </button>
                ))}
              </div>
            </>
          )}

          {deliveryDate && (
            <div className="gc-selected-delivery">
              <strong>Selected delivery</strong>
              <span>{deliveryDate}</span>
              <span>{deliverySlot || "No time slot selected"}</span>
            </div>
          )}

          <button
            className="gc-primary-button"
            onClick={() => {
              if (!deliveryDate || !deliverySlot) {
                window.alert("Please select a delivery date and slot.");
                return;
              }
              goTo("checkout");
            }}
          >
            Continue to checkout →
          </button>
        </div>
      </main>
    );
  }

  function renderCheckout() {
    return (
      <main className="gc-content">
        <div className="gc-eyebrow">ALMOST THERE</div>
        <h1>Checkout</h1>
        <h2 className="gc-sr-only">Checkout details</h2>
        <p className="gc-lead">
          Confirm your contact details and simulated payment method.
        </p>

        <div className="gc-checkout-grid">
          <section className="gc-panel gc-form-panel">
            <h3>Contact information</h3>

            <label htmlFor="gc-name">Full name</label>
            <input
              id="gc-name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />

            <label htmlFor="gc-email">Email address</label>
            <input
              id="gc-email"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
            />

            <label htmlFor="gc-phone">Phone number</label>
            <input
              id="gc-phone"
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
            />

            <h3>Payment method</h3>

            <label className="gc-payment-option">
              <input
                type="radio"
                name="gc-payment"
                value="TEST-APPROVE"
                checked={paymentMethod === "TEST-APPROVE"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              TEST-APPROVE — Simulated successful payment
            </label>

            <label className="gc-payment-option">
              <input
                type="radio"
                name="gc-payment"
                value="TEST-DECLINE"
                checked={paymentMethod === "TEST-DECLINE"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              TEST-DECLINE — Simulated declined payment
            </label>

            <p className="gc-helper">
              These are test options only. No real payment will be processed.
            </p>

            <button
              className="gc-primary-button gc-full-button"
              onClick={placeOrder}
            >
              Place order · {formatINR(orderTotal)}
            </button>

            {orderCount > 0 && (
              <div className="gc-order-success">
                <span>✓</span>
                <h3>Order confirmed!</h3>
                <p>
                  Your simulated order has been placed successfully.
                </p>
                <strong>Confirmation #{1000 + orderCount}</strong>
                {orderCount > 1 && (
                  <p>{orderCount} order confirmations generated.</p>
                )}
              </div>
            )}
          </section>

          <aside className="gc-panel gc-order-summary">
            <h3>Order overview</h3>

            {cartItems.map((item) => (
              <div className="gc-summary-row" key={item.productId}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <strong>{formatINR(item.subtotal)}</strong>
              </div>
            ))}

            <div className="gc-summary-row">
              <span>Delivery</span>
              <strong>₹40</strong>
            </div>

            <div className="gc-summary-total">
              <span>Total</span>
              <strong>{formatINR(orderTotal)}</strong>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  function renderNotebook() {
    return (
      <main className="gc-content">
        <div className="gc-eyebrow">YOUR TESTING WORKSPACE</div>
        <h1>QA Notebook</h1>
        <h2 className="gc-sr-only">QA notebook</h2>
        <p className="gc-lead">
          Record the issues you discover while exploring Grocer Central.
        </p>

        <div className="gc-notebook-layout">
          <form className="gc-panel gc-report-form" onSubmit={saveReport}>
            <h3>{editingReport ? "Edit finding" : "Report a finding"}</h3>

            <label htmlFor="gc-report-title">Finding title *</label>
            <input
              id="gc-report-title"
              value={reportForm.title}
              onChange={(event) =>
                updateReportField("title", event.target.value)
              }
              placeholder="Briefly describe the issue"
              required
            />

            <label htmlFor="gc-report-area">Area *</label>
            <select
              id="gc-report-area"
              value={reportForm.area}
              onChange={(event) =>
                updateReportField("area", event.target.value)
              }
            >
              {AREAS.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>

            <label htmlFor="gc-report-steps">Reproduction steps *</label>
            <textarea
              id="gc-report-steps"
              rows="3"
              value={reportForm.steps}
              onChange={(event) =>
                updateReportField("steps", event.target.value)
              }
              placeholder="1. Open the page..."
              required
            />

            <label htmlFor="gc-report-expected">Expected result *</label>
            <textarea
              id="gc-report-expected"
              rows="3"
              value={reportForm.expected}
              onChange={(event) =>
                updateReportField("expected", event.target.value)
              }
              required
            />

            <label htmlFor="gc-report-actual">Actual result *</label>
            <textarea
              id="gc-report-actual"
              rows="3"
              value={reportForm.actual}
              onChange={(event) =>
                updateReportField("actual", event.target.value)
              }
              required
            />

            <label htmlFor="gc-report-severity">Severity *</label>
            <select
              id="gc-report-severity"
              value={reportForm.severity}
              onChange={(event) =>
                updateReportField("severity", event.target.value)
              }
            >
              {SEVERITIES.map((severity) => (
                <option key={severity}>{severity}</option>
              ))}
            </select>

            <button className="gc-primary-button gc-full-button" type="submit">
              {editingReport ? "Update finding" : "Save finding"}
            </button>

            {editingReport && (
              <button
                className="gc-secondary-button"
                type="button"
                onClick={() => {
                  setEditingReport(null);
                  setReportForm(EMPTY_REPORT);
                }}
              >
                Cancel editing
              </button>
            )}

            {reportMessage && (
              <p className="gc-form-message">{reportMessage}</p>
            )}
          </form>

          <section className="gc-panel gc-reports-list">
            <div className="gc-report-list-heading">
              <h3>Saved findings</h3>
              <span>{reports.length} reports</span>
            </div>

            {reports.length === 0 && (
              <div className="gc-empty-state">
                <span>📝</span>
                <h3>No findings yet</h3>
                <p>Your saved QA reports will appear here.</p>
              </div>
            )}

            {reports.map((report, index) => (
              <article className="gc-report-card" key={report.id}>
                <div className="gc-report-card-top">
                  <span>FINDING #{index + 1}</span>
                  <span className={`gc-severity ${report.severity.toLowerCase()}`}>
                    {report.severity}
                  </span>
                </div>

                <h4>{report.title}</h4>
                <p>{report.area}</p>
                <div className="gc-report-actions">
                  <button onClick={() => editReport(report)}>Edit</button>
                  <button onClick={() => deleteReport(report.id)}>Delete</button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    );
  }

  function renderAnswerKey() {
    const resultLabel =
      score >= 11
        ? "Excellent — Release guardian"
        : score >= 8
          ? "Strong — Good eye for defects"
          : score >= 5
            ? "Developing — More exploration needed"
            : "Keep investigating — Try another hunt";

    return (
      <main className="gc-content gc-answer-page">
        <div className="gc-eyebrow">RELEASE REVIEW COMPLETE</div>
        <h1>The answers are in.</h1>
        <p className="gc-lead">
          Here are the {BUGS.length} planted issues in the Grocer Central
          release. Compare them with your findings.
        </p>

        <section className="gc-score-panel">
          <div className="gc-score-circle">
            <strong>{score}/{BUGS.length}</strong>
            <span>Discovered</span>
          </div>

          <div>
            <div className="gc-eyebrow">YOUR SELF-CHECK SCORE</div>
            <h2>{percentage}%</h2>
            <h3>{resultLabel}</h3>
            <p>
              Mark the issues you identified during your testing. Each
              discovered issue earns one point.
            </p>
          </div>
        </section>

        <div className="gc-answer-heading">
          <h2>Defect answer key</h2>
          <span>{discovered.length} of {BUGS.length} marked</span>
        </div>

        <div className="gc-answer-list">
          {BUGS.map((bug) => (
            <article className="gc-answer-card" key={bug.id}>
              <div className="gc-answer-top">
                <span className="gc-bug-number">BUG {String(bug.id).padStart(2, "0")}</span>
                <span className={`gc-priority ${bug.priority.toLowerCase()}`}>
                  {bug.priority}
                </span>
              </div>

              <h3>{bug.title}</h3>
              <p className="gc-answer-area">{bug.area}</p>

              <div className="gc-answer-detail">
                <strong>How to reproduce</strong>
                <p>{bug.reproduction}</p>
              </div>

              <div className="gc-answer-detail">
                <strong>Expected behaviour</strong>
                <p>{bug.expected}</p>
              </div>

              <div className="gc-answer-detail">
                <strong>Actual behaviour</strong>
                <p>{bug.actual}</p>
              </div>

              <div className="gc-answer-detail">
                <strong>Impact</strong>
                <p>{bug.impact}</p>
              </div>

              <label className="gc-discovered-check">
                <input
                  type="checkbox"
                  checked={discovered.includes(bug.id)}
                  onChange={() => toggleDiscovered(bug.id)}
                />
                I discovered this issue
              </label>
            </article>
          ))}
        </div>

        <div className="gc-replay-panel">
          <div>
            <h2>Ready for another release?</h2>
            <p>
              Replay the challenge from the beginning. Your reports and
              challenge progress will be cleared.
            </p>
          </div>

          <button className="gc-primary-button" onClick={replayChallenge}>
            ↻ Replay challenge
          </button>
        </div>

        <p className="gc-disclaimer">
          This score is a learning self-assessment, not a formal QA
          certification.
        </p>
      </main>
    );
  }

  function renderCurrentPage() {
    switch (page) {
      case "shop":
        return renderShop();
      case "cart":
        return renderCart();
      case "delivery":
        return renderDelivery();
      case "checkout":
        return renderCheckout();
      case "notebook":
        return renderNotebook();
      case "answer":
        return renderAnswerKey();
      default:
        return renderShop();
    }
  }

  return (
    <div className="grocer-central">
      {renderHeader()}

      {renderNavigation()}

      <div className="gc-challenge-strip">
        <span>
          <span className="gc-live-dot" /> RELEASE HUNT IN PROGRESS
        </span>
        <span>Explore carefully. Report what you find.</span>
      </div>

      <div className="gc-app-body">
        {renderCurrentPage()}
      </div>

      <footer className="gc-footer">
        <span>🥬 Grocer Central</span>
        <span>Simulated QA environment · No real transactions</span>
      </footer>

      {showBriefing && renderBriefing()}
    </div>
  );
}