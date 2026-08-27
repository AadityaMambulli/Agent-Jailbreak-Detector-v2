"""Mock Razorpay payment agent for handling customer requests, discounts, and refunds."""

from typing import Dict, Any


class MockPaymentAgent:
    def __init__(self, max_discount_pct: float = 20.0, max_refund_amount: float = 5000.0):
        self.max_discount_pct = max_discount_pct
        self.max_refund_amount = max_refund_amount

    def process_payment_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate processing a customer payment/refund/discount action."""
        action = request.get("action", "inquiry")
        amount = request.get("amount", 0.0)

        if action == "apply_discount":
            discount_pct = request.get("discount_pct", 0.0)
            if discount_pct > self.max_discount_pct:
                return {
                    "status": "rejected",
                    "reason": f"Discount {discount_pct}% exceeds merchant ceiling of {self.max_discount_pct}%.",
                }
            return {
                "status": "approved",
                "discount_pct": discount_pct,
                "final_amount": amount * (1 - discount_pct / 100.0),
            }

        elif action == "issue_refund":
            if amount > self.max_refund_amount:
                return {
                    "status": "rejected",
                    "reason": f"Refund amount ₹{amount} exceeds agent threshold of ₹{self.max_refund_amount}.",
                }
            return {
                "status": "approved",
                "refund_id": f"rfnd_{int(amount)}_mock",
                "amount": amount,
            }

        return {
            "status": "processed",
            "message": "Payment query answered successfully.",
        }
