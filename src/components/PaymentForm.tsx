import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface PaymentFormProps {
  bookingId: string;
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ bookingId, totalAmount, onSuccess, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "upi" | "net_banking">("upi");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const createPayment = useMutation(api.payments.createPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      await createPayment({
        bookingId: bookingId as Id<"bookings">,
        paymentMethod,
        ...(paymentMethod === "credit_card" || paymentMethod === "debit_card" ? cardDetails : {}),
      });
      
      toast.success("Payment successful! Your booking is confirmed.");
      onSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
      
      <div className="mb-6 p-4 bg-white/20 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Order Summary</h3>
        <div className="flex justify-between text-white">
          <span>Total Amount:</span>
          <span className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-3">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "upi", label: "UPI", icon: "📱" },
              { value: "credit_card", label: "Credit Card", icon: "💳" },
              { value: "debit_card", label: "Debit Card", icon: "💳" },
              { value: "net_banking", label: "Net Banking", icon: "🏦" },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === method.value
                    ? "border-purple-400 bg-purple-500/20 text-white"
                    : "border-white/20 bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <div className="text-sm font-medium">{method.label}</div>
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === "upi" && (
          <div>
            <label className="block text-white font-semibold mb-2">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm / yourname@gpay"
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white placeholder-white/60"
              required
            />
          </div>
        )}

        {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Cardholder Name</label>
              <input
                type="text"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white placeholder-white/60"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Card Number</label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white placeholder-white/60"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white placeholder-white/60"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">CVV</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white placeholder-white/60"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "net_banking" && (
          <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-white text-center">
              You will be redirected to your bank's website to complete the payment securely.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
