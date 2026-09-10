type UploadConversionParams = {
  gclid?: string | null;
  code: string;
  value?: number;
  currency?: string;
};

function getGoogleAdsMode(): 'api' | 'gtag' {
  return 'api';
}

async function uploadConversionViaGtag({
  code,
  value = 0,
  currency = 'BRL',
}: {
  code: string;
  value: number;
  currency: string;
}) {
  try {
    if (typeof window !== 'undefined') {
      const sendTo = 'AW-11405399413/ZmQjCLeD4O0cEPWqwr4q';
      window.gtag?.('event', 'conversion', {
        send_to: sendTo,
        transaction_id: code,
        value,
        currency,
      });
    }
  } catch (error) {
    console.error('[ads] gtag fallback error:', error);
  }

  return { mode: 'gtag', code, ok: true };
}

async function uploadConversionViaApi({
  gclid,
  code,
  value = 0,
  currency = 'BRL',
}: UploadConversionParams) {
  try {
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

    if (!customerId || !developerToken || !clientId || !clientSecret || !refreshToken) {
      console.warn('[ads] Google Ads API configurada, mas faltam credenciais.');
      return { mode: 'api', code, ok: false, reason: 'missing_credentials' };
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      throw new Error(`Google OAuth refresh falhou: ${text}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('Google Ads API access token ausente.');
    }

    const conversionAction = `customers/${customerId}/conversionActions/7757625524`;
    if (!gclid) {
      return { mode: 'api', code, ok: false, reason: 'missing_gclid' };
    }
    const conversionDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ') + '+00:00';
    const apiUrl = `https://googleads.googleapis.com/v18/customers/${customerId}:uploadClickConversions`;

    const payload = {
      conversions: [
        {
          gclid: gclid || '',
          conversion_action: conversionAction,
          conversion_date_time: conversionDateTime,
          conversion_value: value,
          currency_code: currency,
          order_id: code,
        },
      ],
      validate_only: false,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'login-customer-id': loginCustomerId || customerId,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google Ads upload falhou: ${text}`);
    }

    return { mode: 'api', code, ok: true };
  } catch (error) {
    console.error('[ads] uploadConversionViaApi error:', error);
    return { mode: 'api', code, ok: false, reason: 'request_failed' };
  }
}

export async function uploadConversion(params: UploadConversionParams) {
  const mode = getGoogleAdsMode();

  if (mode === 'api') {
    return uploadConversionViaApi(params);
  }

  return uploadConversionViaGtag({
    code: params.code,
    value: params.value ?? 0,
    currency: params.currency ?? 'BRL',
  });
}
