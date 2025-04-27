import React, { useState } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const TransferEth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask.');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const recipient = "0x8619c7753F2AC1F2C96a90aD6D19b3df50a8EA93"; // Example address
      const amount = "0.0000"; // Use a valid amount

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      await tx.wait();

      const email = localStorage.getItem('myemail') || '';
      const otp = localStorage.getItem('otp') || '';

      const payload = { email, otp, txHash: tx.hash };

      console.log('Payload to send:', email);

      if (!email || !otp || !tx.hash) {
        console.error('Error: Missing required data in the payload!');
        alert('Required data is missing!');
        return;
      }

      const endpoint = "https://xmer.onrender.com/api/logTransaction";

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();
      console.log('Response from server:', responseBody);

      const result = JSON.parse(responseBody);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to log transaction');
      }

      // If successful, show the success message
      setSuccessMessage('✅ Please check your email for the transaction hash.');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please check console or email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-md bg-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Send ETH with MetaMask</h2>
      <button
        onClick={handleTransfer}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Send 0.0001 ETH'}
      </button>
      {successMessage && (
        <p className="mt-4 text-sm text-green-600">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default TransferEth;
