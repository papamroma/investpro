import axios from 'axios';

const MPESA_BASE_URL = process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;

// Get OAuth token
export async function getMpesaToken(): Promise<string> {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await axios.get(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
            headers: {
                Authorization: `Basic ${auth}`
            }
        }
    );

    return response.data.access_token;
}

// Generate password for STK Push
function generatePassword(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
    return password;
}

// Get timestamp
function getTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

// Initiate STK Push
export async function initiateSTKPush(phone: string, amount: number, accountReference: string) {
    try {
        const token = await getMpesaToken();
        const timestamp = getTimestamp();
        const password = generatePassword();

        // Format phone number (remove + and ensure it starts with 254)
        let formattedPhone = phone.replace(/\+/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.slice(1);
        }
        if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }

        const payload = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.floor(amount),
            PartyA: formattedPhone,
            PartyB: SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: 'InvestPro Deposit'
        };

        const response = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            checkoutRequestId: response.data.CheckoutRequestID,
            merchantRequestId: response.data.MerchantRequestID,
            responseCode: response.data.ResponseCode,
            responseDescription: response.data.ResponseDescription
        };

    } catch (error: any) {
        console.error('M-Pesa STK Push error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errorMessage || 'Failed to initiate payment'
        };
    }
}

// Query STK Push status
export async function querySTKPushStatus(checkoutRequestId: string) {
    try {
        const token = await getMpesaToken();
        const timestamp = getTimestamp();
        const password = generatePassword();

        const payload = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId
        };

        const response = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error: any) {
        console.error('M-Pesa query error:', error.response?.data || error.message);
        throw error;
    }
}
