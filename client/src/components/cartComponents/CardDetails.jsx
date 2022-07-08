import React, { useState, useEffect } from "react";
import {
  CartDetailsContainer,
  CartTypeContainer,
} from "../../pages/customerPages/cart/cartComponents";
import {
  CheckoutDetailsContainer,
  CheckOutDetails,
} from "../../pages/customerPages/cart/cartComponents";
import Gcash from "./PaymentType/Gcash";
import Card from "./PaymentType/Card";
import Paypal from "./PaymentType/Paypal";
import shopingCartLogic from "./logic/shopingCartLogic";

function CardDetails({ items, setItems, toast }) {
  const [paymentType, setPaymentType] = useState("card");

  const pickPaymentType = (cardType) => {
    setPaymentType(cardType);
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const { calculateTotalAmount, productPriceFormatter } = shopingCartLogic();

  useEffect(() => {
    setTotalAmount(calculateTotalAmount(items));
    if(paymentType === "paypal") setPaymentType("card")
     // temporary solution
  }, [items]);

  return (
    <CartDetailsContainer>
      <h2>Payment</h2>

      <CartTypeContainer>
        <h4>Choose your prefered payment method</h4>

        <div className="card__type">
          <div
            className={paymentType === "card" ? `card activeCardPayment` : "card"}
            onClick={() => pickPaymentType("card")}
          >
            <img src="/images/imgbin_mastercard-png.png" />
          </div>

          <div
            className={paymentType === "gcash" ? `card activeCardPayment` : "card"}
            onClick={() => pickPaymentType("gcash")}
          >
            <img src="/images/gcash.png" />
          </div>

          <div
            className={
              paymentType === "paypal" ? `card activeCardPayment` : "card"
            }
            onClick={() => pickPaymentType("paypal")}
          >
            <img src="/images/imgbin_paypal-png.png" />
          </div>
        </div>
      </CartTypeContainer>

      <CheckoutDetailsContainer>
        <CheckOutDetails>
          <span class="leftDetails">Subtotal</span>
          <span class="rightDetails subtotalPrice">
            {productPriceFormatter(totalAmount)}
          </span>
        </CheckOutDetails>

        <CheckOutDetails>
          <span class="leftDetails">Shipping</span>
          <span class="rightDetails shippingPrice">
            {productPriceFormatter(totalAmount * 0.01)}
          </span>
        </CheckOutDetails>

        <CheckOutDetails>
          <span class="leftDetails">Total</span>
          <span class="rightDetails totalAmount">
            {productPriceFormatter(totalAmount * 0.01 + totalAmount)}
          </span>
        </CheckOutDetails>
      </CheckoutDetailsContainer>

      {paymentType === "paypal" && (
        <Paypal
          items={items}
          totalAmount={totalAmount * 0.01 + totalAmount}
          toast={toast}
        />
      )}

      {paymentType === "card" && (
        <Card
          items={items}
          totalAmount={totalAmount * 0.01 + totalAmount}
          toast={toast}
        />
      )}

      {paymentType === "gcash" && (
        <Gcash
          items={items}
          totalAmount={totalAmount * 0.01 + totalAmount}
          toast={toast}
        />
      )}
      {/* {paymentType === "" && (<span style={{color:"white"}}>Checkout some item first</span>)} */}
    </CartDetailsContainer>
  );
}

export default CardDetails;
