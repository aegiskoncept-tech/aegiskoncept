export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || 'aegiskoncept8f9c1b2e3d4a5b6c7d8e9f0a';

export const SITE_HOST =
  process.env.NEXT_PUBLIC_SITE_HOST || 'aegiskoncept.com';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aegiskoncept.com';

export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  status: number;
  data?: any;
  error?: string;
}> {
  if (!urls || urls.length === 0) {
    return { success: false, status: 400, error: 'No URLs provided' };
  }

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`)),
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
    };
  } catch (err: any) {
    console.error('IndexNow submission error:', err);
    return {
      success: false,
      status: 500,
      error: err.message || 'Network error',
    };
  }
}

