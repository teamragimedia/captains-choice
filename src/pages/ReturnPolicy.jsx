import React from "react";
import "../styles/AccessibilityStatement.css";

function AccessibilityStatement() {
  return (
    <div className="policy-container">
      <h1>Return Policy</h1>

      <p>
        We offer refund/exchange within the first <strong>3 days</strong> from
        the date of your purchase. If 3 days have passed since your purchase,
        you will not be offered a return, exchange or refund of any kind.
      </p>

      <section>
        <h2>Return & Exchange Eligibility</h2>

        <p>
          In order to become eligible for a return or an exchange, the following
          conditions must be satisfied:
        </p>

        <ul>
          <li>
            The purchased item should be unused and in the same condition in
            which you received it.
          </li>
          <li>The item must be returned with its original packaging.</li>
          <li>
            If the item was purchased during a sale, it may not be eligible for
            a return or exchange.
          </li>
        </ul>

        <p>
          Further, items will only be replaced by us (based on an exchange
          request) if they are found to be defective or damaged.
        </p>
      </section>

      <section>
        <h2>Non-Returnable Products</h2>

        <p>
          You agree that certain categories of products or items may be exempt
          from returns or refunds. Such categories will be clearly identified at
          the time of purchase.
        </p>
      </section>

      <section>
        <h2>Inspection & Approval</h2>

        <p>
          For accepted return or exchange requests, once your returned product
          is received and inspected by us, we will notify you by email
          confirming the receipt of the returned or exchanged item.
        </p>

        <p>
          If the product passes our quality inspection, your return or exchange
          request will be processed in accordance with our policies.
        </p>
      </section>
    </div>
  );
}

export default AccessibilityStatement;
