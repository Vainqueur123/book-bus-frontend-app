import React, { useState, useMemo, useEffect, useCallback } from 'react';
import "./BookingConfirm.css" 

const TICKET_PRICE = 2000;
const BUS_CAPACITY = 30;
const DISQUALIFICATION_MINUTES = 30;

const mockTicketData = {
  userName: 'Andres Nora (Logged In)',
  route: 'Kigali - Musanze',
  date: '27 Nov 2025',
  time: '14:30',
  bus: 'Volcano Express',
  ticketId: `BUS-TICKET-${Math.floor(Math.random() * 900000 + 100000)}`,
};

const bankOptions = [
  'BK (Bank of Kigali)',
  'BPR (Banque Populaire du Rwanda)',
  'Equity Bank',
  'Cogebanque',
  'Other',
];
const cardOptions = ['Mastercard', 'Visa', 'American Express', 'UnionPay'];

const PaymentMethodSelection = ({ onSelect, selectedMethod }) => {
  const methods = [
    { name: 'MTN Mobile Money',  className: 'mobile-money mtn' },
    { name: 'Airtel Money', className: 'mobile-money airtel' },
    { name: 'Bank Transfer (Select Bank)',  className: 'bank-transfer' },
  ];
  return (
    <div className="payment-methods-grid">
      {methods.map((method) => (
        <button
          key={method.name}
          className={`method-tile ${method.className} ${selectedMethod === method.name ? 'selected' : ''}`}
          onClick={() => onSelect(method.name)}
        >
          <span className="method-icon">{method.icon}</span>
          <span className="method-name">
            {method.name.includes('(')
              ? method.name.substring(0, method.name.indexOf('(')).trim()
              : method.name}
          </span>
        </button>
      ))}
    </div>
  );
};

const SubSelectionPanel = ({ title, options, onSelectSub, currentSelection }) => {
  return (
    <div className="sub-selection-panel">
      <p className="sub-title">{title}</p>
      <div className="sub-options-grid">
        {options.map((option) => (
          <button
            key={option}
            className={`sub-option-btn ${currentSelection === option ? 'selected' : ''}`}
            onClick={() => onSelectSub(option)}
          >
            {option.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

const getExpirationTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const arrivalDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );
  const expirationMs = arrivalDate.getTime() + DISQUALIFICATION_MINUTES * 60 * 1000;
  return new Date(expirationMs);
};

const TicketView = ({ ticketData, seats, onScanSuccess }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanned, setIsScanned] = useState(false);
  const expirationTime = useMemo(() => getExpirationTime(ticketData.time), [ticketData.time]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const timeRemainingMs = expirationTime.getTime() - currentTime.getTime();
  const isQualified = timeRemainingMs > 0;
  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const statusClass = isScanned ? 'scanned' : isQualified ? 'qualified' : 'disqualified';
  const statusText = isScanned ? 'SCANNED - USED' : isQualified ? 'QUALIFIED' : 'DISQUALIFIED';
  const showCountdownWarning = isQualified && timeRemainingMs < 300000;

  const handleSimulateScan = () => {
    setIsScanned(true);
    onScanSuccess();
  };

  if (isScanned) {
    return (
      <div className="payment-completed-section scanned-success">
        <h2 className="section-title success">Ticket Used Successfully!</h2>
        <p className="success-message">
          Ticket {ticketData.ticketId} has been validated and consumed by the driver.
        </p>
        <p className="qr-instruction">Thank you for traveling with us.</p>
      </div>
    );
  }

  return (
    <div className="payment-completed-section">
      <h2 className="section-title success">Payment Confirmed!</h2>
      <p className="success-message">Your ticket for {seats} seat(s) is ready.</p>

      <div className={`qr-code-box ${statusClass}`}>
        <div className="qr-status-indicator">{statusText}</div>
        <div className="qr-placeholder">
          <div className="qr-grid">
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell long"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
            <div className="qr-cell"></div>
          </div>
          <span className="qr-text">{ticketData.ticketId}</span>
        </div>
      </div>

      <p className="qr-instruction">Show this code to the driver.</p>

      {showCountdownWarning && (
        <div className="time-warning">
          <p className="warning-text">
            ⚠️ QR code qualification ends in: <span className="countdown">{minutes}m {seconds}s</span>
          </p>
        </div>
      )}
      {!isQualified && (
        <div className="time-expired">
          <p className="expired-text">
            ❌ Ticket expired at {expirationTime.toLocaleTimeString()} ({DISQUALIFICATION_MINUTES} min after arrival).
          </p>
        </div>
      )}

      <div className="action-buttons">
        <button
          className="btn btn-secondary"
          onClick={handleSimulateScan}
          disabled={!isQualified}
        >
          Simulate Driver Scan ({isQualified ? 'Active' : 'Expired'})
        </button>
      </div>
    </div>
  );
};

function BookingConfirm() {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [accountHolderName, setAccountHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [isTicketConsumed, setIsTicketConsumed] = useState(false);

  const totalFare = useMemo(() => {
    return (numberOfSeats * TICKET_PRICE).toLocaleString('en-RW', {
      style: 'currency',
      currency: 'RWF',
    });
  }, [numberOfSeats]);

  const finalPaymentItem = useMemo(() => {
    if (selectedMethod.includes('Bank')) return selectedBank;
    if (selectedMethod.includes('Card')) return selectedCard;
    return selectedMethod;
  }, [selectedMethod, selectedBank, selectedCard]);

  const handleConfirmPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 2000);
  };

  const handleMethodSelection = (methodName) => {
    setSelectedMethod(methodName);
    setSelectedBank('');
    setSelectedCard('');
    setAccountHolderName('');
    setCardNumber('');
    setCardExpiry('');
  };

  const renderPaymentContent = useCallback(() => {
    if (isTicketConsumed) {
      return (
        <div className="payment-completed-section scanned-success">
          <h2 className="section-title success">Ticket Status: USED</h2>
          <p className="success-message">
            Ticket {mockTicketData.ticketId} was successfully scanned and consumed by the driver.
          </p>
          <p className="qr-instruction">This ticket is no longer valid or visible.</p>
        </div>
      );
    }

    switch (paymentStatus) {
      case 'completed':
        return (
          <TicketView
            ticketData={mockTicketData}
            seats={numberOfSeats}
            onScanSuccess={() => setIsTicketConsumed(true)}
          />
        );
      case 'processing':
        return (
          <div className="payment-processing-section">
            <div className="spinner"></div>
            <p className="processing-text">
              Processing Payment of {totalFare} via {finalPaymentItem || selectedMethod}...
            </p>
            <p className="processing-instruction">Do not close this page.</p>
          </div>
        );
      case 'pending':
      default: {
        const isPaymentDetailFilled =
          (finalPaymentItem && finalPaymentItem.includes('Money')) ||
          (finalPaymentItem && finalPaymentItem.includes('Bank') && accountHolderName.length > 3) ||
          (finalPaymentItem &&
            finalPaymentItem.includes('Card') &&
            accountHolderName.length > 3 &&
            cardNumber.length === 16 &&
            cardExpiry.length === 5);

        const isReadyToConfirm =
          isPaymentDetailFilled && numberOfSeats > 0 && numberOfSeats <= BUS_CAPACITY;

        return (
          <>
            <div className="payment-selection-section">
              <h2 className="section-title">Payment Details</h2>

              <div className="seat-selection-box">
                <label htmlFor="seat-count" className="seat-label">
                  Number of Seats (Max {BUS_CAPACITY})
                </label>
                <input
                  type="number"
                  id="seat-count"
                  className="seat-input"
                  value={numberOfSeats}
                  min="1"
                  max={BUS_CAPACITY}
                  onChange={(e) => setNumberOfSeats(Number(e.target.value))}
                />
                <p className="price-per-seat">
                  Price per seat: {TICKET_PRICE.toLocaleString('en-RW')} RWF
                </p>
              </div>

              <h3 className="sub-section-title">Select Payment Method</h3>
              <PaymentMethodSelection
                onSelect={handleMethodSelection}
                selectedMethod={selectedMethod}
              />

              {selectedMethod.includes('Bank') && (
                <SubSelectionPanel
                  title="Choose Your Bank:"
                  options={bankOptions}
                  onSelectSub={setSelectedBank}
                  currentSelection={selectedBank}
                />
              )}
              {selectedMethod.includes('Card') && (
                <SubSelectionPanel
                  title="Choose Card Type:"
                  options={cardOptions}
                  onSelectSub={setSelectedCard}
                  currentSelection={selectedCard}
                />
              )}

              {finalPaymentItem && (
                <div className="payment-input-area">
                  <p className="payment-prompt-title">Payment Confirmation Details</p>

                  {finalPaymentItem.includes('Money') && (
                    <div className="payment-mobile-money-message">
                      A Mobile Money push notification for {totalFare} <br/>will be sent to your phone shortly.
                    </div>
                  )}

                  {(finalPaymentItem.includes('Bank') || finalPaymentItem.includes('Card')) && (
                    <>
                      <div className="form-group">
                        <label className="settings-label">Account Holder Name</label>
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Name on Account/Card"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {finalPaymentItem.includes('Card') && (
                    <>
                      <div className="form-group">
                        <label className="settings-label">Card Number (16 digits)</label>
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="**** **** **** ****"
                          maxLength="16"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                      </div>
                      <div className="form-group half-width">
                        <label className="settings-label">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/[^0-9/]/g, ''))}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="selected-method-summary">
                <p>
                  Selected Payment:{' '}
                  <span className="method-name-display">
                    {finalPaymentItem || selectedMethod || 'None Selected'}
                  </span>
                </p>
              </div>
            </div>

            <div className="confirm-fare-box">
              <div className="fare-label">Total Fare for {numberOfSeats} Seat(s)</div>
              <div className="fare-amount">{totalFare}</div>
            </div>
            <div className='confirm-buttons'>
              <button
              className="btn btn-primary btn-confirm"
              onClick={handleConfirmPayment}
              disabled={!isReadyToConfirm}>
              Confirm Payment
            </button>
            <button className="btn btn-secondary btn-cancel">Cancel Booking</button>
            </div>
            
          </>
        );
      }
    }
  }, [
    paymentStatus,
    numberOfSeats,
    totalFare,
    finalPaymentItem,
    selectedMethod,
    selectedBank,
    selectedCard,
    accountHolderName,
    cardNumber,
    cardExpiry,
    isTicketConsumed,
  ]);

  return (
    <div className="booking-confirm-page">
      <header className="page-header">
        <h1 className="header-title">Booking Confirmation</h1>
        <p className="header-subtitle">Review your details and complete payment.</p>
      </header>

      <div className="main-content-container">
        <div className="payment-detail-panel">{renderPaymentContent()}</div>
      </div>
    </div>
  );
}

export default BookingConfirm;
